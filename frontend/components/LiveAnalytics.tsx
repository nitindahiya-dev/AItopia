import { motion } from 'framer-motion';
import { Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, Database, Box } from 'lucide-react';
import { TooltipProps } from 'recharts';

const LiveAnalytics = () => {
  const activityData = [
    { time: '00:00', usage: 40, trend: 45 },
    { time: '04:00', usage: 65, trend: 70 },
    { time: '08:00', usage: 85, trend: 90 },
    { time: '12:00', usage: 95, trend: 98 },
    { time: '16:00', usage: 75, trend: 80 },
    { time: '20:00', usage: 60, trend: 65 },
  ];

  const resourceData = [
    { name: 'Compute', value: 45, color: '#FF6B35' },
    { name: 'Storage', value: 30, color: '#FFA500' },
    { name: 'Network', value: 25, color: '#FFD700' },
  ];

  const projects = [
    { name: 'AI Core', progress: 85, color: '#FF6B35' },
    { name: 'Cloud Sync', progress: 60, color: '#FFA500' },
    { name: 'Data Mesh', progress: 45, color: '#FFD700' },
  ];

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="font-loos-wide text-orange">{payload[0].payload.time}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-orange rounded-full" />
            <span className="font-aeroport">Usage: {payload[0].value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen py-28 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 30, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-orange/10 to-amber-500/10 blur-3xl -top-64 -left-64 rounded-full"
      />

      <div className="relative z-10 container mx-auto px-5 md:px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-loos-wide text-6xl md:text-8xl bg-gradient-to-r from-orange to-amber-500 bg-clip-text text-transparent mb-6"
          >
            Live System Pulse
          </motion.h2>
          <p className="font-aeroport text-xl text-white/80 max-w-2xl mx-auto">
            Real-time monitoring and predictive analytics for your digital ecosystem
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Enhanced Data Flow Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="backdrop-blur-xl h-96 bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange/20 rounded-xl text-orange">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-loos-wide text-2xl">Data Flow</h3>
              </div>

              <div className="relative flex-1 min-h-[220px]">
                {/* Radial Gradient Background */}
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,#FF6B3525_0%,transparent_62%)]" />

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: -10, right: 0, bottom: 0, left: 0 }}>
                    {/* Animated Outer Ring */}
                    <Pie
                      data={[{ value: 100 }]}
                      dataKey="value"
                      cx="50%"
                      cy="48%"
                      innerRadius={68}
                      outerRadius={80}
                      fill="transparent"
                      stroke="#FFA50020"
                      strokeWidth={2}
                    />

                    {/* Main Data Pie */}
                    <Pie
                      data={resourceData}
                      cx="50%"
                      cy="48%"
                      innerRadius={54}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {resourceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>

                    {/* Floating Center */}
                    <text
                      x="50%"
                      y="46%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-loos-wide text-3xl"
                      fill="#FFA500"
                    >
                      {resourceData.reduce((acc, curr) => acc + curr.value, 0)}%
                    </text>
                    <text
                      x="50%"
                      y="56%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-aeroport text-sm"
                      fill="#FFFFFF80"
                    >
                      Total Load
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-[-4px] grid grid-cols-3 gap-2">
                {resourceData.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center"
                  >
                    <div className="mb-1 flex items-center justify-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-aeroport text-xs text-white/70">{item.name}</span>
                    </div>
                    <p className="font-loos-wide text-sm" style={{ color: item.color }}>
                      {item.value}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Live Activity Section */}
          <motion.div
            className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange/20 rounded-xl text-orange">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-loos-wide text-2xl">Live Activity</h3>
              <div className="ml-auto flex items-center gap-2 text-orange">
                <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
                <span className="font-aeroport">Real-time</span>
              </div>
            </div>

            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Trend Area */}
                  <Area
                    type="monotone"
                    dataKey="trend"
                    stroke="#FFA50060"
                    fill="url(#gradientFill)"
                    strokeWidth={1}
                  />

                  {/* Main Usage Line */}
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#FF6B35"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#FF6B35",
                      stroke: "#FFFFFF",
                      strokeWidth: 2
                    }}
                  />

                  {/* Threshold Line */}
                  <ReferenceLine
                    y={80}
                    stroke="#FFA50060"
                    strokeDasharray="4 4"
                  />


                  <Tooltip content={<CustomTooltip />} />
                  <CartesianGrid stroke="#FFFFFF10" vertical={false} />
                </AreaChart>
              </ResponsiveContainer>

              {/* Animated Pulse Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    'radial-gradient(600px at 50% 50%, rgba(255,107,53,0) 0%, rgba(255,107,53,0) 100%)',
                    'radial-gradient(600px at 50% 50%, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0) 100%)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Project Timeline */}
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <Box className="w-6 h-6" style={{ color: project.color }} />
                </div>
                <h3 className="font-loos-wide text-2xl">{project.name}</h3>
              </div>

              <div className="space-y-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: project.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
                <div className="flex justify-between font-aeroport text-white/60">
                  <span>Development Progress</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default LiveAnalytics;