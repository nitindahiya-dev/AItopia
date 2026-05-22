import { motion } from 'framer-motion';
import { GitMerge, Satellite, BrainCircuit, Network, Database } from 'lucide-react';
import React from 'react';


const TeamNetwork = () => {
  const nodes = [
    {
      id: 1,
      type: 'core',
      name: 'AI Engine',
      description: 'Neural processing core',
      x: 40,
      y: 5,
      connections: [2, 3],
      icon: <BrainCircuit className="w-8 h-8" />
    },
    {
      id: 2,
      type: 'interface',
      name: 'UX Nexus',
      description: 'User experience layer',
      x: 5,
      y: 35,
      connections: [1, 4],
      icon: <Satellite className="w-8 h-8" />
    },
    {
      id: 3,
      type: 'data',
      name: 'Quantum DB',
      description: 'Distributed storage',
      x: 75,
      y: 35,
      connections: [1, 4],
      icon: <Database className="w-8 h-8" />
    },
    {
      id: 4,
      type: 'edge',
      name: 'API Mesh',
      description: 'Global endpoints',
      x: 40,
      y: 70,
      connections: [2, 3],
      icon: <Network className="w-8 h-8" />
    }
  ];

  const connections = [
    { from: 1, to: 2, strength: 0.9 },
    { from: 1, to: 3, strength: 0.7 },
    { from: 2, to: 4, strength: 0.8 },
    { from: 3, to: 4, strength: 0.6 }
  ];

  return (
    <div className="relative min-h-screen py-28 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -left-[400px] top-1/4 w-[1000px] h-[1000px] bg-gradient-to-r from-orange/10 to-amber-500/10 blur-3xl rounded-full"
      />
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-loos-wide text-6xl md:text-8xl bg-gradient-to-r from-orange to-amber-500 bg-clip-text text-transparent mb-6"
          >
            Neural Architecture
          </motion.h2>
          <p className="font-aeroport text-xl text-white/80 max-w-2xl mx-auto">
            Interactive visualization of our {`platform's`} living ecosystem
          </p>
        </div>

        {/* Interactive Network */}
        <div className="relative h-[800px] w-full bg-white/5 border border-white/10 rounded-[40px] p-12">
          {/* Connections */}
          {connections.map((connection, index) => {
            const fromNode = nodes.find(n => n.id === connection.from);
            const toNode = nodes.find(n => n.id === connection.to);
            // Skip rendering if either node is undefined
            if (!fromNode || !toNode) return null;
            return (
              <motion.div
                key={index}
                className="absolute h-0.5 bg-orange/30 origin-left"
                style={{
                  width: `${Math.hypot(
                    (toNode.x - fromNode.x) * 10,
                    (toNode.y - fromNode.y) * 10
                  )}%`,
                  left: `${fromNode.x}%`,
                  top: `${fromNode.y}%`,
                  rotate: Math.atan2(
                    (toNode.y - fromNode.y) * 10,
                    (toNode.x - fromNode.x) * 10
                  ) * (180 / Math.PI)
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2 + index, repeat: Infinity }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-orange/50 transition-all"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: '300px'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange/20 rounded-xl text-orange">
                  {node.icon}
                </div>
                <div>
                  <h3 className="font-loos-wide text-2xl">{node.name}</h3>
                  <p className="font-aeroport text-white/60">{node.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-aeroport text-sm text-white/60">Health</span>
                  <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-400 rounded-full" 
                      style={{ width: `${Math.random() * 40 + 60}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-aeroport text-sm text-white/60">Load</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div 
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/10"
                        style={{ 
                          opacity: i < (node.connections.length / 2) ? 1 : 0.3,
                          backgroundColor: i < 2 ? '#FFA500' : undefined 
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Floating Interaction */}
          <motion.div 
            className="absolute backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-4 cursor-pointer"
            style={{ left: '45%', top: '70%' }}
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 45, 90, 135, 180, 225, 270, 315, 0]
            }}
            transition={{
              y: { duration: 3, repeat: Infinity },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
          >
            <GitMerge className="w-8 h-8 text-orange" />
          </motion.div>
        </div>

        {/* Legend */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {['Core Systems', 'Interface Layer', 'Data Network', 'Edge Nodes'].map((label, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange shadow-[0_0_10px_rgba(255,165,0,0.6)]" />
                <span className="font-loos-wide text-sm md:text-base truncate">{label}</span>
                <div className="ml-auto font-aeroport text-white/60 text-sm">0{i + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamNetwork;
