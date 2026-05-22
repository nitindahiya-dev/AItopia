import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Cloud, Clock, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Define UserData type (consistent with Dashboard)
type UserData = {
  name: string;
  email: string;
  lastLogin: string | null;
  profileImage?: string | null;
};

// Define props interface for ProfileTab
interface ProfileTabProps {
  userData: UserData | null;
  loading: boolean;
}

// Helpers for avatar
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const getColorFromHash = (hash: number): string => {
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

const generateAvatarSVG = (email: string): string => {
  const hash = hashString(email);
  const size = 128;
  const cells = 5;
  const cellSize = size / cells;

  const pattern: number[] = [];
  for (let i = 0; i < cells * cells; i++) {
    pattern.push((hash + i) % 2);
  }

  const color = getColorFromHash(hash);
  const svgCells = pattern
    .map((value, index) => {
      if (value === 0) return null;
      const x = (index % cells) * cellSize;
      const y = Math.floor(index / cells) * cellSize;
      return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" />`;
    })
    .filter(Boolean)
    .join('');

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#2D2D2D" />
      ${svgCells}
    </svg>
  `;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ userData, loading }) => {
  const { user } = useAuth();

  // Controlled input for name editing
  const [name, setName] = useState(userData?.name || '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync name input when userData changes
  React.useEffect(() => {
    setName(userData?.name || '');
  }, [userData]);

  // Save changes
  const handleSave = async () => {
    if (!user) return;
    setFeedback(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Update failed');
      }
      await res.json(); // Parse response to ensure success, but don't store it
      setFeedback({ type: 'success', message: 'Profile updated!' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFeedback({ type: 'error', message: err.message });
      } else {
        setFeedback({ type: 'error', message: 'An unknown error occurred' });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white/50">Loading profile…</div>;
  }

  if (!userData) {
    return <div className="text-center py-20 text-white/50">No profile data available.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-loos-wide text-3xl text-orange">Profile Settings</h2>
        <div className="flex items-center gap-3 text-green-400">
          <Shield className="w-5 h-5" />
          <span>Security Status: Excellent</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Avatar & Edit Form */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 lg:col-span-1">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-full bg-orange/20 flex items-center justify-center mx-auto overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: userData.email
                  ? generateAvatarSVG(userData.email)
                  : '<svg width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="#2D2D2D"/></svg>',
              }}
            />
            <div className="absolute bottom-0 right-0 p-2 bg-white/10 rounded-full cursor-pointer hover:bg-orange/20 transition-all">
              <Upload className="w-5 h-5" />
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="font-aeroport text-white/80">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/10 p-3 rounded-xl focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full bg-orange py-3 rounded-xl text-black font-loos-wide mt-4"
            onClick={handleSave}
          >
            Save Changes
          </motion.button>

          {/* Feedback */}
          {feedback && (
            <div className={`text-sm mt-2 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {feedback.message}
            </div>
          )}
        </div>

        {/* Read-Only Account Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-loos-wide text-xl">Account Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: userData.name, icon: <User /> },
                { label: 'Email', value: userData.email, icon: <Cloud /> },
                {
                  label: 'Last Login',
                  value: userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'Never',
                  icon: <Clock />,
                },
                { label: '2FA', value: 'Enabled', icon: <Shield /> },
              ].map((field, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4"
                >
                  {field.icon}
                  <div>
                    <div className="font-aeroport text-white/80">{field.label}</div>
                    <div className="font-loos-wide">{field.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileTab;