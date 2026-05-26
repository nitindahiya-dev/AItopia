import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { loadRazorpayScript } from '../../components/razorpayUtils';
import { useAuth } from '../../context/AuthContext';

// Declare Razorpay on window object
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: RazorpayResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface PackageType {
  id: string;
  title: string;
  price: number;
  features: string[];
  toolsIncluded: number | string;
  gradient: string;
  recommended?: boolean;
}

interface AuthUser {
  token: string;
  name?: string;
  email?: string;
  subscription?: {
    plan: string;
    selectedTools: string[];
  };
}

interface Props {
  packages: PackageType[];
  selectedPackage: PackageType | null;
  setSelectedPackage: (pkg: PackageType) => void;
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
  user: AuthUser | null; // Changed to allow null
}

const allTools: string[] = [
  'Artisan AI',
  'VoiceCraft',
  'LingoSync',
  'NeuroChat',
  'CodeForge',
  'VisionX',
  'DataMiner',
  'QuantumCore',
  'TextGenix',
  'ImageSynth',
];

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const CheckoutModal: React.FC<{
  selectedPackage: PackageType;
  allTools: string[];
  onConfirm: (selectedTools: string[]) => void;
  onClose: () => void;
  user: AuthUser | null; // Changed to allow null
}> = ({ selectedPackage, allTools, onConfirm, onClose, user }) => {
  const [step, setStep] = useState<'selectTools' | 'payment'>('selectTools');
  const [localSelectedTools, setLocalSelectedTools] = useState<string[]>([]);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { updateUserSubscription, refreshUserProfile } = useAuth();

  const handleToolSelect = (tool: string): void => {
    const limit = selectedPackage.toolsIncluded;
    if (limit === 'Unlimited' || localSelectedTools.length < (limit as number)) {
      setLocalSelectedTools((prev) =>
        prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
      );
    } else if (localSelectedTools.includes(tool)) {
      setLocalSelectedTools((prev) => prev.filter((t) => t !== tool));
    }
  };

  const handleProceedToPayment = (): void => {
    console.log('Proceeding to payment with tools:', localSelectedTools);
    setStep('payment');
  };

  const handlePaymentSuccess = async (): Promise<void> => {
    if (!user) {
      setPaymentError('User not authenticated');
      return;
    }
    console.log('Payment successful, updating subscription...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/subscription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          plan: selectedPackage.id,
          selectedTools: localSelectedTools,
          amount: selectedPackage.price,
        }),
      });
      if (res.ok) {
        const updatedSubscription = await res.json();
        const subscriptionData = {
          status: updatedSubscription.status || 'active',
          plan: updatedSubscription.plan || selectedPackage.id,
          selectedTools: updatedSubscription.selectedTools || localSelectedTools,
        };
        updateUserSubscription(subscriptionData);
        await refreshUserProfile(); // Ensure latest data in context
        console.log('Subscription updated successfully:', subscriptionData);
        onConfirm(localSelectedTools);
        onClose();
      } else {
        const errorData = await res.json();
        setPaymentError(`Failed to save subscription: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating subscription:', error);
        setPaymentError('Failed to save your subscription. Please try again.');
      }
    }
  };

  const handleRazorpayPayment = async (): Promise<void> => {
    setProcessingPayment(true);
    if (!user) {
      setPaymentError('User not authenticated');
      setProcessingPayment(false);
      return;
    }
    if (selectedPackage.price === 0) {
      console.log('Free plan selected; skipping Razorpay payment.');
      await handlePaymentSuccess();
      return;
    }

    console.log('Initiating Razorpay payment...');
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setPaymentError('Razorpay SDK failed to load');
      console.error('Razorpay SDK failed to load');
      setProcessingPayment(false);
      return;
    }

    try {
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPackage.price * 100,
          currency: 'INR',
        }),
      });
      const orderData = await orderResponse.json();
      const orderId = orderData.order_id || orderData.orderId;
      if (!orderResponse.ok || !orderId) {
        setPaymentError('Failed to create Razorpay order');
        console.error('Order creation failed:', orderData);
        setProcessingPayment(false);
        return;
      }

      if (!process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID) {
        setPaymentError('Payment configuration missing');
        console.error('Razorpay key is not defined');
        setProcessingPayment(false);
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
        amount: selectedPackage.price * 100,
        currency: 'INR',
        name: 'AItopia',
        description: `${selectedPackage.title} Plan`,
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          console.log('Razorpay payment response:', response);
          try {
            console.log('Sending verification request to backend...');
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-razorpay-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyResponse.json();
            console.log('Verification response:', verifyData);
            if (verifyData.success) {
              console.log(
                'Razorpay payment verified'
              );
              await handlePaymentSuccess();
              onClose();
            } else {
              setPaymentError('Payment verification failed');
              console.error('Verification failed:', verifyData.error);
            }
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error('Error verifying Razorpay payment:', error);
              setPaymentError('Payment verification failed');
            }
          }
        },
        prefill: {
          name: user.name || 'User',
          email: user.email || '',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: RazorpayResponse) => {
        console.error('Razorpay payment failed:', response);
        setPaymentError('Payment failed');
      });
      rzp.open();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating Razorpay order:', error);
        setPaymentError('Failed to initiate payment');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-custom-black border border-white/10 rounded-2xl p-8 max-w-xl w-full space-y-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-loos-wide">
            {step === 'selectTools' ? 'Select Tools' : 'Choose Payment Method'}
          </h3>
          <X className="cursor-pointer hover:text-orange" onClick={onClose} />
        </div>
        {step === 'selectTools' ? (
          <div className="space-y-4">
            <div className="bg-white/5 p-6 rounded-xl space-y-4">
              <h4 className="font-loos-wide text-lg">{selectedPackage.title} Plan</h4>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-loos-wide">₹{selectedPackage.price}/mo</span>
              </div>
              <div className="space-y-2">
                <span>
                  Select Tools (
                  {selectedPackage.toolsIncluded === 'Unlimited'
                    ? 'Unlimited'
                    : `Up to ${selectedPackage.toolsIncluded}`}
                  )
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {allTools.map((tool) => (
                    <motion.div
                      key={tool}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg cursor-pointer transition-all ${localSelectedTools.includes(tool)
                        ? 'bg-orange text-black'
                        : 'bg-white/5 hover:bg-white/10'
                        } ${selectedPackage.toolsIncluded !== 'Unlimited' &&
                          localSelectedTools.length >= (selectedPackage.toolsIncluded as number) &&
                          !localSelectedTools.includes(tool)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                        }`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <div className="flex items-center gap-2">
                        {localSelectedTools.includes(tool) && <CheckCircle2 className="w-4 h-4" />}
                        {tool}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-xl font-loos-wide bg-orange text-black"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="font-loos-wide text-lg mb-2">Payment for {selectedPackage.title} Plan</h4>
              <div className="flex justify-between mb-2">
                <span>Tools Selected:</span>
                <span className="text-orange">{localSelectedTools.length}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Total:</span>
                <span className="font-loos-wide">₹{selectedPackage.price}/mo</span>
              </div>
            </div>
            {paymentError && <p className="text-red-500">{paymentError}</p>}
            <div className="space-y-4">
              <motion.button
                whileHover={{
                  scale: processingPayment
                    ? 1
                    : 1.05
                }}

                disabled={processingPayment}
                className="w-full py-3 rounded-xl font-loos-wide bg-green-500 text-white disabled:opacity-70"
                onClick={handleRazorpayPayment}
              >

                {processingPayment
                  ? 'Processing Payment...'
                  : 'Pay with Razorpay'}

              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PackageTab: React.FC<Props> = ({
  packages = [], // Default to empty array
  selectedPackage,
  setSelectedPackage,
  setSelectedTools,
  showCheckout,
  setShowCheckout,
  user,
}) => {
  const handleSelectPlan = (pkg: PackageType): void => {
    setSelectedPackage(pkg);
    setSelectedTools([]);
    setShowCheckout(true);
  };

  const handleConfirmSubscription = (tools: string[]): void => {
    setSelectedTools(tools);
    setShowCheckout(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-loos-wide text-3xl text-orange">AI Tool Packages</h2>
        <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center gap-2">
          <span className="font-aeroport">
            Current Plan: {selectedPackage?.title || (user?.subscription?.plan ?? 'None')} Tier
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{ scale: 1.05 }}
              className={`relative backdrop-blur-lg bg-gradient-to-b ${pkg.gradient} border-2 ${pkg.id === selectedPackage?.id ||
                pkg.id === (user?.subscription?.plan?.toLowerCase() ?? '')
                ? 'border-orange'
                : 'border-white/10'
                } rounded-2xl p-8 space-y-6`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 right-0 bg-orange text-black px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm">
                  Most Popular
                </div>
              )}
              <h3 className="font-loos-wide text-2xl">{pkg.title}</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl">₹{pkg.price}</span>
                <span className="text-white/60">/{pkg.price ? 'month' : 'forever'}</span>
              </div>
              <ul className="space-y-2">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-3 rounded-xl font-loos-wide bg-white/5 hover:bg-white/10"
                onClick={() => handleSelectPlan(pkg)}
              >
                {pkg.id === (user?.subscription?.plan?.toLowerCase() ?? '') ? 'Manage Plan' : 'Select Plan'}
              </motion.button>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center">
            <p className="font-aeroport text-white/80">No packages available at the moment.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCheckout && selectedPackage && (
          <CheckoutModal
            selectedPackage={selectedPackage}
            allTools={allTools}
            onConfirm={handleConfirmSubscription}
            onClose={() => setShowCheckout(false)}
            user={user}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PackageTab;