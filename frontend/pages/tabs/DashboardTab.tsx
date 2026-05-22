import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { Server, User, Database, Terminal, Rocket, Shield } from 'lucide-react';

const usageData = [
  { name: 'Mon', usage: 4, sessions: 12 },
  { name: 'Tue', usage: 6, sessions: 18 },
  { name: 'Wed', usage: 8, sessions: 24 },
  { name: 'Thu', usage: 5, sessions: 15 },
  { name: 'Fri', usage: 7, sessions: 21 },
  { name: 'Sat', usage: 9, sessions: 27 },
  { name: 'Sun', usage: 4, sessions: 12 },
];

const DashboardTab: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-loos-wide text-3xl text-orange">Project Dashboard</h2>
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-6 py-3 bg-orange/20 text-orange rounded-xl"
        >
          <Rocket className="w-5 h-5" />
          New Project
        </motion.button> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Projects', value: 8, icon: <Server />, color: '#FF6B35' },
          { title: 'Team Members', value: 24, icon: <User />, color: '#FFA500' },
          { title: 'Storage Used', value: '82%', icon: <Database />, color: '#FFD700' },
          { title: 'API Health', value: '98.9%', icon: <Terminal />, color: '#4CAF50' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-aeroport text-white/60">{stat.title}</p>
                <h3 className="font-loos-wide text-3xl mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-white/10" style={{ color: stat.color }}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-4">Performance Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <Line type="monotone" dataKey="usage" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', strokeWidth: 2 }} />
                <Tooltip contentStyle={{ background: '#2A2A2A', border: 'none', borderRadius: '12px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { title: 'New Deployment', time: '15m ago', user: 'Sarah Chen', icon: <Rocket className="w-5 h-5 text-green-400" /> },
              { title: 'API Update', time: '2h ago', user: 'Alex Turner', icon: <Terminal className="w-5 h-5 text-blue-400" /> },
              { title: 'Security Audit', time: '4h ago', user: 'Security Team', icon: <Shield className="w-5 h-5 text-purple-400" /> },
            ].map((activity, index) => (
              <motion.div key={index} whileHover={{ x: 5 }} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="p-3 rounded-lg bg-white/10">{activity.icon}</div>
                <div>
                  <p className="font-loos-wide">{activity.title}</p>
                  <p className="font-aeroport text-sm text-white/60">{activity.user} • {activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardTab;