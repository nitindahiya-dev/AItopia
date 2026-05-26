import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Sparkles,
  Rocket,
  Fingerprint,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { user, login } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      await login(form.email, form.password);
      router.push('/dashboard');
    } catch {
      // AuthContext handles errors
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      success(data.message || 'OTP sent to your email');
      setShowOTP(true);
      setOtp('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message || 'Failed to sign up.');
      } else {
        error('Failed to sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      success(data.message || 'Email verified successfully');

      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message || 'Invalid OTP');
      } else {
        error('Invalid OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/resend-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      success(data.message || 'OTP resent to your email');
      setOtp('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message || 'Failed to resend OTP');
      } else {
        error('Failed to resend OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showOTP) {
      await handleVerifyOTP();
      return;
    }

    if (activeTab === 'login') {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  const resetToSignup = () => {
    setShowOTP(false);
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-custom-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute w-96 h-96 bg-gradient-to-r from-orange/10 to-amber-500/10 blur-3xl -top-48 -left-48 rounded-full"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute w-64 h-64 bg-gradient-to-br from-orange/20 to-transparent blur-2xl top-1/2 right-0 rounded-full"
        />
      </div>

      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 relative z-10">
        <motion.div
          initial={{
            scale: 0.95,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 max-w-2xl mx-auto shadow-2xl shadow-orange/10"
        >
          <div className="text-center space-y-6 mb-12">
            <motion.div
              whileHover={{
                rotate: -2,
                scale: 1.05,
              }}
              className="inline-block"
            >
              <Rocket className="w-16 h-16 text-orange mx-auto mb-4" />
            </motion.div>

            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-500">
              {showOTP
                ? 'Verify Email'
                : activeTab === 'login'
                ? 'Welcome Back'
                : 'Launch Forward'}
            </h1>

            <p className="font-aeroport text-xl text-white/80">
              {showOTP
                ? 'Enter the OTP sent to your email to continue'
                : activeTab === 'login'
                ? 'Ignite your AI journey with secure access'
                : 'Embark on your innovation adventure'}
            </p>
          </div>

          <div className="flex gap-4 justify-center my-8 relative">
            {showOTP ? (
              <motion.button
                type="button"
                onClick={resetToSignup}
                className="px-8 py-3 rounded-xl font-loos-wide bg-transparent hover:bg-white/5 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            ) : (
              ['login', 'signup'].map((tab) => (
                <motion.button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab as 'login' | 'signup')}
                  className={`px-8 py-3 rounded-xl font-loos-wide relative overflow-hidden ${
                    activeTab === tab
                      ? 'bg-gradient-to-br from-orange to-amber-500 text-black'
                      : 'bg-transparent hover:bg-white/5'
                  }`}
                >
                  {tab === 'login' ? 'Secure Login' : 'Power Signup'}
                </motion.button>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {showOTP ? (
              <>
                <div className="space-y-2">
                  <label className="font-aeroport text-white/80 ml-1">
                    Verification Code
                  </label>

                  <div className="flex items-center gap-4 bg-white/5 border border-orange/30 rounded-xl p-4">
                    <Fingerprint className="w-5 h-5 text-orange" />

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="Enter 6 digit OTP"
                      className="w-full bg-transparent focus:outline-none placeholder-white/30 tracking-[0.35em] text-center"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>

                  <p className="text-sm text-white/60 font-aeroport">
                    OTP sent to <span className="text-orange">{form.email}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-loos-wide py-4 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resend OTP
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full sm:w-1/2 bg-gradient-to-br from-orange to-amber-500 text-black font-loos-wide py-4 rounded-xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Quantum Verifying...
                        </>
                      ) : (
                        <>Verify Quantum OTP</>
                      )}
                    </span>
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {activeTab === 'signup' && (
                  <div className="space-y-2">
                    <label className="font-aeroport text-white/80 ml-1">
                      Full Name
                    </label>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                      <User className="w-5 h-5 text-orange" />

                      <input
                        type="text"
                        name="name"
                        placeholder="Elon Musk"
                        className="w-full bg-transparent focus:outline-none placeholder-white/30"
                        onChange={handleChange}
                        value={form.name}
                      />

                      <Sparkles className="w-5 h-5 text-orange/50" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="font-aeroport text-white/80 ml-1">
                    Email
                  </label>

                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                    <Mail className="w-5 h-5 text-orange" />

                    <input
                      type="email"
                      name="email"
                      placeholder="commander@progressors.space"
                      className="w-full bg-transparent focus:outline-none placeholder-white/30"
                      onChange={handleChange}
                      value={form.email}
                    />

                    <Fingerprint className="w-5 h-5 text-orange/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-aeroport text-white/80 ml-1">
                    Password
                  </label>

                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                    <Lock className="w-5 h-5 text-orange" />

                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent focus:outline-none placeholder-white/30"
                      onChange={handleChange}
                      value={form.password}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-br from-orange to-amber-500 text-black font-loos-wide py-4 rounded-xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        {activeTab === 'login'
                          ? 'Quantum Signing In...'
                          : 'Quantum Registering...'}
                      </>
                    ) : (
                      <>
                        {activeTab === 'login'
                          ? 'Quantum Sign In'
                          : 'Create Warp Drive'}
                      </>
                    )}
                  </span>
                </motion.button>
              </>
            )}
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;