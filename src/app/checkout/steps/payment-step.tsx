'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, Loader2 } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { StripeProvider } from '@/components/stripe-provider';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createStripePaymentIntent } from '../actions';

interface PaymentStepProps {
  onComplete: () => void;
}

function StripePaymentForm({ onComplete, onPaymentConfirmed }: { 
  onComplete: () => void;
  onPaymentConfirmed: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Stripe and Elements are loaded
    if (!stripe || !elements) {
      setError('Payment form is not ready. Please wait a moment and try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Validate form before submission
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Please check your payment details and try again.');
        setProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        // Handle different Stripe error types
        let errorMessage = 'Payment failed. Please try again.';
        
        if (confirmError.type === 'card_error' || confirmError.type === 'validation_error') {
          errorMessage = confirmError.message || 'Please check your card details and try again.';
        } else if (confirmError.type === 'rate_limit_error') {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (confirmError.message) {
          errorMessage = confirmError.message;
        }
        
        setError(errorMessage);
        setProcessing(false);
        return;
      }

      // Validate payment intent
      if (!paymentIntent) {
        setError('Payment confirmation incomplete. Please try again.');
        setProcessing(false);
        return;
      }

      // Check payment status
      if (paymentIntent.status === 'succeeded') {
        // Validate payment intent ID
        if (!paymentIntent.id || paymentIntent.id.length === 0) {
          setError('Payment succeeded but confirmation failed. Please contact support.');
          setProcessing(false);
          return;
        }
        
        // Payment succeeded, store the payment intent ID and proceed
        onPaymentConfirmed(paymentIntent.id);
        onComplete();
      } else if (paymentIntent.status === 'processing') {
        // Payment is processing (e.g., requires authentication)
        setError('Your payment is being processed. Please wait...');
        // Don't set processing to false - keep loading state
      } else if (paymentIntent.status === 'requires_action') {
        // Payment requires additional action (e.g., 3D Secure)
        // Stripe will handle the redirect automatically
        setError('Additional authentication required. Please complete the verification.');
        setProcessing(false);
      } else {
        // Payment in unexpected state
        setError(`Payment status: ${paymentIntent.status}. Please try again or contact support.`);
        setProcessing(false);
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
      >
        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue to review
      </Button>
    </form>
  );
}

export default function PaymentStep({ onComplete }: PaymentStepProps) {
  const { 
    paymentMethods, 
    selectedPaymentMethodCode, 
    setSelectedPaymentMethodCode,
    setStripePaymentIntentId 
  } = useCheckout();
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const isStripeMethod = (code: string) => {
    return code.toLowerCase().includes('stripe');
  };

  useEffect(() => {
    // Create Stripe payment intent when Stripe method is selected
    if (selectedPaymentMethodCode && isStripeMethod(selectedPaymentMethodCode)) {
      let isCancelled = false;
      
      const createPaymentIntent = async () => {
        setLoadingStripe(true);
        setStripeError(null);
        setStripeClientSecret(null);
        
        try {
          const result = await createStripePaymentIntent();

          // Don't update state if component unmounted or payment method changed
          if (isCancelled) return;

          if (result.success && result.clientSecret) {
            // Validate client secret before setting
            if (result.clientSecret && result.clientSecret.length > 0) {
              setStripeClientSecret(result.clientSecret);
            } else {
              setStripeError('Invalid payment intent received. Please try again.');
            }
          } else {
            const errorMessage = result.error || 'Failed to create payment intent. Please try again.';
            setStripeError(errorMessage);
          }
        } catch (error) {
          if (isCancelled) return;
          
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to create payment intent. Please try again.';
          setStripeError(errorMessage);
        } finally {
          if (!isCancelled) {
            setLoadingStripe(false);
          }
        }
      };

      createPaymentIntent();
      
      // Cleanup function to prevent state updates if component unmounts or payment method changes
      return () => {
        isCancelled = true;
      };
    } else {
      setStripeClientSecret(null);
      setStripeError(null);
      setLoadingStripe(false);
    }
  }, [selectedPaymentMethodCode]);

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No payment methods available.</p>
      </div>
    );
  }

  const selectedMethod = paymentMethods.find(m => m.code === selectedPaymentMethodCode);
  const showStripeForm = selectedMethod && isStripeMethod(selectedMethod.code) && stripeClientSecret && !loadingStripe;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Select payment method</h3>

      <RadioGroup value={selectedPaymentMethodCode || ''} onValueChange={setSelectedPaymentMethodCode}>
        {paymentMethods.map((method) => (
          <Label key={method.code} htmlFor={method.code} className="cursor-pointer">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value={method.code} id={method.code} />
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{method.name}</p>
                  {method.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {method.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      {selectedPaymentMethodCode && isStripeMethod(selectedPaymentMethodCode) ? (
        <div className="mt-6">
          {loadingStripe ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading payment form...</p>
            </div>
          ) : stripeError ? (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive font-medium">Error loading payment form</p>
              <p className="text-sm text-destructive/80 mt-1">{stripeError}</p>
            </div>
          ) : stripeClientSecret ? (
            <StripeProvider clientSecret={stripeClientSecret}>
              <StripePaymentForm 
                onComplete={onComplete}
                onPaymentConfirmed={(paymentIntentId) => {
                  setStripePaymentIntentId(paymentIntentId);
                }}
              />
            </StripeProvider>
          ) : (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">Preparing payment form...</p>
            </div>
          )}
        </div>
      ) : selectedPaymentMethodCode && !isStripeMethod(selectedPaymentMethodCode) ? (
        <Button
          onClick={onComplete}
          disabled={!selectedPaymentMethodCode}
          className="w-full mt-6"
        >
          Continue to review
        </Button>
      ) : null}
    </div>
  );
}
