'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Truck, CreditCard, Edit } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { placeOrder as placeOrderAction } from '../actions';
import { Price } from '@/components/commerce/price';

interface ReviewStepProps {
  onEditStep: (step: 'shipping' | 'delivery' | 'payment') => void;
}

export default function ReviewStep({ onEditStep }: ReviewStepProps) {
  const { order, paymentMethods, selectedPaymentMethodCode, stripePaymentIntentId } = useCheckout();
  const [loading, setLoading] = useState(false);

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.code === selectedPaymentMethodCode
  );

  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    // Validate prerequisites
    if (!selectedPaymentMethodCode) {
      setError('Please select a payment method.');
      return;
    }

    if (!order.shippingAddress) {
      setError('Please provide a shipping address.');
      return;
    }

    if (!order.shippingLines || order.shippingLines.length === 0) {
      setError('Please select a shipping method.');
      return;
    }

    // For Stripe payments, validate payment intent ID
    const isStripePayment = selectedPaymentMethodCode.toLowerCase().includes('stripe');
    if (isStripePayment && !stripePaymentIntentId) {
      setError('Payment confirmation is required. Please complete the payment step.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // For Stripe payments, pass the payment intent ID
      await placeOrderAction(selectedPaymentMethodCode, stripePaymentIntentId || undefined);
      // If we get here without redirect, something went wrong
      // But redirect() throws, so we shouldn't reach here
    } catch (error) {
      // Check if this is a Next.js redirect (which is expected)
      if (error instanceof Error) {
        const isRedirect = 
          error.message.includes('NEXT_REDIRECT') || 
          (error as any).digest?.startsWith('NEXT_REDIRECT');
        
        if (isRedirect) {
          // This is a redirect, not an error - let it propagate
          throw error;
        }
        
        // Extract user-friendly error message
        let errorMessage = error.message || 'Failed to place order. Please try again.';
        
        // Clean up technical error messages
        if (errorMessage.includes('Server Components render')) {
          if ((error as any).originalError) {
            errorMessage = (error as any).originalError.message || errorMessage;
          } else {
            errorMessage = 'An error occurred while processing your order. Please try again.';
          }
        }
        
        setError(errorMessage);
        setLoading(false);
      } else {
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Review your order</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Shipping Address</h4>
          </div>
          {order.shippingAddress ? (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.streetLine1}
                  {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                <p className="text-muted-foreground">{order.shippingAddress.phoneNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep('shipping')}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No shipping address set</p>
          )}
        </div>

        {/* Delivery Method */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Delivery Method</h4>
          </div>
          {order.shippingLines && order.shippingLines.length > 0 ? (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">{order.shippingLines[0].shippingMethod.name}</p>
                <p className="text-muted-foreground">
                  {order.shippingLines[0].priceWithTax === 0
                    ? 'FREE'
                    : <Price value={order.shippingLines[0].priceWithTax} currencyCode={order.currencyCode} />}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep('delivery')}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No delivery method selected</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Payment Method</h4>
          </div>
          {selectedPaymentMethod ? (
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">{selectedPaymentMethod.name}</p>
                {selectedPaymentMethod.description && (
                  <p className="text-muted-foreground mt-1">
                    {selectedPaymentMethod.description}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep('payment')}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment method selected</p>
          )}
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        disabled={loading || !order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode}
        size="lg"
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Place Order
      </Button>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive font-medium">Error placing order</p>
          <p className="text-sm text-destructive/80 mt-1">{error}</p>
        </div>
      )}

      {(!order.shippingAddress || !order.shippingLines?.length || !selectedPaymentMethodCode) && (
        <p className="text-sm text-destructive text-center">
          Please complete all previous steps before placing your order
        </p>
      )}
    </div>
  );
}
