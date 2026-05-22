import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from 'recharts';

const usageData = [
  { name: 'Mon', usage: 4, sessions: 12 },
  { name: 'Tue', usage: 6, sessions: 18 },
  { name: 'Wed', usage: 8, sessions: 24 },
  { name: 'Thu', usage: 5, sessions: 15 },
  { name: 'Fri', usage: 7, sessions: 21 },
  { name: 'Sat', usage: 9, sessions: 27 },
  { name: 'Sun', usage: 4, sessions: 12 },
];

const toolUsageData = [
  { name: 'Artisan AI', value: 40, color: '#FF6B35' },
  { name: 'VoiceCraft', value: 30, color: '#FFA500' },
  { name: 'LingoSync', value: 20, color: '#FFD700' },
  { name: 'NeuroChat', value: 10, color: '#FFE4B5' },
];

const AnalysisTab: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="font-loos-wide text-3xl text-orange">Advanced Analytics</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-4">Performance Overview</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <Line type="monotone" dataKey="usage" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', strokeWidth: 2 }} />
                <Tooltip contentStyle={{ background: '#2A2A2A', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-4">Resource Allocation</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={toolUsageData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {toolUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {toolUsageData.map((tool, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: tool.color }} />
                  <span className="font-aeroport">{tool.name}</span>
                  <span className="ml-auto font-loos-wide">{tool.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisTab;