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

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded, store the payment intent ID
      onPaymentConfirmed(paymentIntent.id);
      onComplete();
    } else {
      setError('Payment was not completed. Please try again.');
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
      const createPaymentIntent = async () => {
        setLoadingStripe(true);
        setStripeError(null);
        setStripeClientSecret(null);
        try {
          const result = await createStripePaymentIntent();

          if (result.success && result.clientSecret) {
            setStripeClientSecret(result.clientSecret);
          } else {
            const errorMessage = result.error || 'Failed to create Stripe payment intent';
            setStripeError(errorMessage);
          }
        } catch (error) {
          setStripeError(error instanceof Error ? error.message : 'Failed to create payment intent');
        } finally {
          setLoadingStripe(false);
        }
      };

      createPaymentIntent();
    } else {
      setStripeClientSecret(null);
      setStripeError(null);
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
