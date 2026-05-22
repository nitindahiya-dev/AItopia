import React from 'react';
import { motion } from 'framer-motion';
import { ThemePreference, useTheme } from '../../context/ThemeContext';

type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  theme: string;
};

type AuthUser = {
  token: string;
  name?: string;
  email?: string;
  subscription?: {
    plan: string;
    selectedTools: string[];
  };
};

type SettingsTabProps = {
  notificationSettings?: NotificationSettings;
  setNotificationSettings: (settings: NotificationSettings) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  passwordError: string;
  setPasswordError: (value: string) => void;
  passwordSuccess: string;
  setPasswordSuccess: (value: string) => void;
  deleteConfirm: boolean;
  setDeleteConfirm: (value: boolean) => void;
  user: AuthUser | null;
  logout: () => void;
};

// Only keys for notifications (excluding 'theme')
type NotificationKey = keyof Omit<NotificationSettings, 'theme'>;

const SettingsTab: React.FC<SettingsTabProps> = ({
  // Provide a default value if notificationSettings is undefined
  notificationSettings = {
    emailNotifications: false,
    pushNotifications: false,
    smsAlerts: false,
    theme: 'System',
  },
  setNotificationSettings,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  setPasswordError,
  passwordSuccess,
  setPasswordSuccess,
  deleteConfirm,
  setDeleteConfirm,
  user,
  logout,
}) => {
  const [deleteError, setDeleteError] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const updateSettings = async (updates: Partial<NotificationSettings>) => {
    if (!user) return;
    const newSettings = { ...notificationSettings, ...updates };
    setNotificationSettings(newSettings);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update settings');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating settings:', error);
      }
    }
  };

  const handleToggleNotification = (key: NotificationKey) => {
    updateSettings({ [key]: !notificationSettings[key] });
  };

  const handleThemeChange = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    updateSettings({ theme: nextTheme });
  };

  const handleChangePassword = async () => {
    if (!user) {
      setPasswordError('User not authenticated');
      return;
    }
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    try {
      // Updated endpoint and method to match backend: PATCH /users/password
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
      setPasswordSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setPasswordError(error.message || 'Something went wrong');
      } else {
        setPasswordError('Something went wrong');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      setDeleteError('User not authenticated');
      return;
    }
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setDeleteError('');
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/delete-account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }
      logout();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setDeleteError(error.message || 'Failed to delete account');
      } else {
        setDeleteError('Failed to delete account');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="font-loos-wide text-3xl text-orange">System Settings</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <div
          className={`backdrop-blur-lg border rounded-2xl p-6 ${
            resolvedTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <h3 className="font-loos-wide text-xl mb-6">Preferences</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="font-loos-wide">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Light', value: 'light' as ThemePreference },
                  { label: 'Dark', value: 'dark' as ThemePreference },
                  { label: 'System', value: 'system' as ThemePreference },
                ].map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleThemeChange(option.value)}
                    className={`p-4 rounded-xl cursor-pointer text-center ${
                      theme === option.value
                        ? 'bg-orange text-black'
                        : resolvedTheme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-loos-wide">Notifications</label>
              <div className="space-y-3">
                {([
                  { label: 'Email Notifications', key: 'emailNotifications' },
                  { label: 'Push Notifications', key: 'pushNotifications' },
                  { label: 'SMS Alerts', key: 'smsAlerts' },
                ] as const).map((setting) => (
                  <div
                    key={setting.key}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      resolvedTheme === 'dark' ? 'bg-white/5' : 'bg-slate-100'
                    }`}
                  >
                    <span>{setting.label}</span>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleNotification(setting.key)}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                        notificationSettings[setting.key] ? 'bg-green-400' : 'bg-white/10'
                      }`}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-lg"
                        animate={{ x: notificationSettings[setting.key] ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`backdrop-blur-lg border rounded-2xl p-6 ${
            resolvedTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <h3 className="font-loos-wide text-xl mb-6">Account Security</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="font-loos-wide">Change Password</label>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full border rounded-xl p-4 focus:outline-none focus:border-orange ${
                  resolvedTheme === 'dark'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border rounded-xl p-4 focus:outline-none focus:border-orange ${
                  resolvedTheme === 'dark'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-400 text-sm">{passwordSuccess}</p>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChangePassword}
                className="w-full py-3 bg-orange text-black rounded-xl font-loos-wide"
              >
                Update Password
              </motion.button>
            </div>
            <div className="space-y-4">
              <label className="font-loos-wide">Delete Account</label>
              <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                This action is irreversible. All your data will be permanently deleted.
              </p>
              {deleteError && <p className="text-red-400 text-sm">{deleteError}</p>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`w-full py-3 rounded-xl font-loos-wide ${
                  deleteConfirm
                    ? 'bg-red-500 text-white'
                    : resolvedTheme === 'dark'
                    ? 'bg-white/5 text-red-400 hover:bg-white/10'
                    : 'bg-slate-100 text-red-500 hover:bg-slate-200'
                } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isDeleting ? 'Deleting...' : deleteConfirm ? 'Confirm Deletion' : 'Delete Account'}
              </motion.button>
              {deleteConfirm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteConfirm(false)}
                  className={`w-full py-3 rounded-xl font-loos-wide ${
                    resolvedTheme === 'dark'
                      ? 'bg-white/5 text-white hover:bg-white/10'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
