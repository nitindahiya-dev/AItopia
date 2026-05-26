import { Paintbrush, Code2, BrainCircuit, BookText, Speech, ImageDown, Clapperboard, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ToolsPage = () => {
  const { user, updateUserSubscription } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showToolModal, setShowToolModal] = useState(false);
  const [localSelectedTools, setLocalSelectedTools] = useState<string[]>([]);

  // Safely extract subscription info
  const subscription =
    user?.subscription && typeof user.subscription === 'object'
      ? user.subscription
      : null;
  const hasSubscription = subscription?.status === 'active';
  const purchasedTools = subscription?.selectedTools && Array.isArray(subscription.selectedTools) ? subscription.selectedTools : [];
  const plan = subscription?.plan?.toLowerCase() || 'unknown'; // Normalize to lowercase

  // Define package limits based on plan IDs (aligned with PackageTab)
  const packageLimits: { [key: string]: number } = {
    starter: 3,
    pro: 8, // Matches "pro" from subscription.plan
    enterprise: Infinity, // Unlimited
  };

  const maxTools = packageLimits[plan] || 0;
  const remainingTools = maxTools === Infinity ? Infinity : Math.max(0, maxTools - purchasedTools.length);

  // List of all available tools, aligned with PackageTab
  const allTools = [
    { name: 'Artisan AI', category: 'Generative AI', icon: <Paintbrush className="w-8 h-8" />, description: 'Transform text prompts into stunning digital artwork', link: '/tools/artisanai', linkedPackages: ['Pro', 'Enterprise'] },
    { name: 'VoiceCraft', category: 'Audio', icon: <Speech className="w-8 h-8" />, description: 'Real-time voice cloning and modulation', link: '/tools/voicecraft', linkedPackages: ['Pro'] },
    { name: 'LingoSync', category: 'Video', icon: <Clapperboard className="w-8 h-8" />, description: 'Add subtitles to your video', link: '/tools/lingosync', linkedPackages: ['Starter', 'Pro'] },
    { name: 'NeuroChat', category: 'Productivity', icon: <BrainCircuit className="w-8 h-8" />, description: 'Context-aware intelligent chatbot with memory', link: '/comingsoon', linkedPackages: ['Pro'], comingSoon: true },
    { name: 'CodeForge', category: 'Development', icon: <Code2 className="w-8 h-8" />, description: 'AI-powered code completion and debugging assistant', link: '/comingsoon', linkedPackages: ['Enterprise'], comingSoon: true },
    { name: 'VisionX', category: 'Image', icon: <ImageDown className="w-8 h-8" />, description: 'Advanced image processing and analysis', link: '/comingsoon', linkedPackages: ['Enterprise'], comingSoon: true },
    { name: 'DataMiner', category: 'Productivity', icon: <BrainCircuit className="w-8 h-8" />, description: 'Automated data extraction and insights', link: '/comingsoon', linkedPackages: ['Enterprise'], comingSoon: true },
    { name: 'QuantumCore', category: 'Development', icon: <Code2 className="w-8 h-8" />, description: 'Quantum computing simulation tool', link: '/comingsoon', linkedPackages: ['Enterprise'], comingSoon: true },
    { name: 'TextGenix', category: 'Writing', icon: <BookText className="w-8 h-8" />, description: 'Advanced content generation and rewriting', link: '/tools/textgenix', linkedPackages: ['Starter', 'Pro'] },
    { name: 'ImageSynth', category: 'Generative AI', icon: <ImageDown className="w-8 h-8" />, description: 'Text-to-image generation with style control', link: '/comingsoon', linkedPackages: ['Enterprise'], comingSoon: true },
  ];

  // Categories available for public view
  const categories = ['all', 'Generative AI', 'Development', 'Productivity', 'Image', 'Video', 'Audio', 'Writing'];

  // Filtering logic for tools grid
  const filteredTools = hasSubscription && purchasedTools.length > 0
    ? allTools.filter((tool) => purchasedTools.includes(tool.name))
    : allTools
      .filter((tool) => selectedCategory === 'all' || tool.category === selectedCategory)
      .filter((tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle tool selection in modal
  const handleToolSelect = (tool: string) => {
    if (maxTools === Infinity || localSelectedTools.length < maxTools) {
      setLocalSelectedTools((prev) =>
        prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
      );
    } else if (localSelectedTools.includes(tool)) {
      setLocalSelectedTools((prev) => prev.filter((t) => t !== tool));
    }
  };

  // Save selected tools to subscription
  const handleSaveTools = async () => {
    if (!user || !subscription) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/subscription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ plan: subscription.plan, selectedTools: localSelectedTools }),
      });
      if (res.ok) {
        const updatedSubscription = await res.json();
        const subscriptionData = {
          status: updatedSubscription.status || 'active',
          plan: updatedSubscription.plan || subscription.plan,
          selectedTools: updatedSubscription.selectedTools || localSelectedTools,
        };
        updateUserSubscription(subscriptionData);
        setShowToolModal(false);
      } else {
        console.error('Failed to update subscription:', await res.json());
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  // Open modal with current tools pre-selected
  const openToolModal = () => {
    setLocalSelectedTools(purchasedTools);
    setShowToolModal(true);
  };

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="uppercase md:mt-6 font-loos-wide text-4xl md:text-6xl xl:text-7xl font-bold text-orange"
          >
            AI Toolbox
          </motion.h1>

          {!hasSubscription && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                Unlock the full potential of AI with our curated toolkit. Choose a plan to access premium features.
              </p>
              <div className="flex flex-col items-center gap-6">
                <Link
                  href="/dashboard"
                  className="bg-orange text-black px-8 py-3 rounded-xl font-loos-wide hover:bg-amber-500 transition-all"
                >
                  View Packages
                </Link>
              </div>
            </motion.div>
          )}

          {/* Subscription Status Banner */}
          {hasSubscription && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-orange/20 to-amber-500/20 p-6 rounded-2xl border border-orange/50"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-2">
                  <h3 className="font-loos-wide text-xl">
                    Active Plan: {subscription?.plan || 'Unknown'}
                  </h3>
                  <p className="font-aeroport text-white/80">
                    Tools Selected: {purchasedTools.length} /{' '}
                    {maxTools === Infinity ? 'Unlimited' : maxTools} (
                    {remainingTools === Infinity ? 'Unlimited' : remainingTools} remaining)
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={openToolModal}
                    className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-all"
                  >
                    Manage Tools
                  </button>
                  <Link
                    href="/dashboard"
                    className="bg-orange text-black px-6 py-2 rounded-xl hover:bg-amber-500 transition-all"
                  >
                    Manage Subscription
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* For non-subscribed users, show search & category filters */}
        {!hasSubscription && (
          <>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-white/5 rounded-xl w-full md:w-1/2 mb-6"
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-xl font-loos-wide transition-all ${selectedCategory === category
                      ? 'bg-orange text-black'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTools.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="font-aeroport text-white/80">
                {hasSubscription
                  ? 'No tools selected. Manage your tools to add some!'
                  : 'No tools match your search.'}
              </p>
              {hasSubscription && (
                <button
                  onClick={openToolModal}
                  className="inline-block mt-4 bg-orange text-black px-6 py-2 rounded-xl hover:bg-amber-500 transition-all"
                >
                  Add Tools
                </button>
              )}
            </div>
          ) : (
            filteredTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-orange/20 rounded-xl text-orange">{tool.icon}</div>
                  <span className="font-aeroport text-sm text-white/60">{tool.category}</span>
                </div>
                <h3 className="font-loos-wide text-2xl text-white mb-3">
                  {tool.name}
                  {tool.comingSoon && (
                    <span className="ml-2 text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </h3>
                <p className="font-aeroport text-white/80 mb-6 line-clamp-2">{tool.description}</p>
                {hasSubscription ? (
                  <Link href={tool.link} className="flex items-center gap-3 text-orange">
                    Access Tool
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-up-right"
                    >
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <div className="h-px bg-white/10" />
                    <p className="font-aeroport text-sm text-white/60">
                      Available in {tool.linkedPackages?.[0] || 'Pro'} Plan
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-block bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
                    >
                      Unlock Access
                    </Link>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Educational Section for non-subscribed users */}
        {!hasSubscription && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-4">
              <h3 className="font-loos-wide text-2xl text-orange">How It Works</h3>
              <p className="font-aeroport text-white/80 max-w-2xl mx-auto">
                Choose from our flexible plans to access the AI tools you need. Start with our free tier or unlock premium features with our Pro and Enterprise plans.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Starter Pack', price: 'Free', features: ['3 Basic Tools', 'Community Support', '100 Credits/Month', 'Basic AI Models'], color: 'from-blue-500/20 to-purple-500/20' },
                { title: 'Professional', price: '₹49/month', features: ['8 Tools Access', 'Priority Support', 'Unlimited API Calls', 'Advanced AI Models'], color: 'from-orange/20 to-amber-500/20' },
                { title: 'Enterprise', price: '₹149/month', features: ['Unlimited Tools', 'Custom AI Models', '24/7 Support', 'Dedicated Infrastructure'], color: 'from-emerald-500/20 to-cyan-500/20' },
              ].map((plan, i) => (
                <div key={i} className={`bg-gradient-to-b ${plan.color} p-6 rounded-xl border border-white/10 space-y-4`}>
                  <h4 className="font-loos-wide text-xl">{plan.title}</h4>
                  <p className="text-2xl font-loos-wide">{plan.price}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 font-aeroport text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard" className="inline-block w-full text-center bg-white/5 py-2 rounded-xl hover:bg-white/10 transition-all">
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tool Selection Modal for Subscribed Users */}
        <AnimatePresence>
          {showToolModal && hasSubscription && (
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
                  <h3 className="text-2xl font-loos-wide">Manage Your Tools</h3>
                  <X className="cursor-pointer hover:text-orange" onClick={() => setShowToolModal(false)} />
                </div>
                <div className="bg-white/5 p-6 rounded-xl space-y-4">
                  <h4 className="font-loos-wide text-lg">{subscription?.plan} Plan</h4>
                  <div className="flex justify-between">
                    <span>Tools Selected:</span>
                    <span className="font-loos-wide">
                      {localSelectedTools.length} / {maxTools === Infinity ? 'Unlimited' : maxTools}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span>
                      Select Tools ({remainingTools === Infinity ? 'Unlimited' : `${remainingTools} remaining`})
                    </span>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {allTools.map((tool) => (
                        <motion.div
                          key={tool.name}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-lg cursor-pointer transition-all ${localSelectedTools.includes(tool.name)
                              ? 'bg-orange text-black'
                              : 'bg-white/5 hover:bg-white/10'
                            } ${maxTools !== Infinity &&
                              localSelectedTools.length >= maxTools &&
                              !localSelectedTools.includes(tool.name)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                            }`}
                          onClick={() => handleToolSelect(tool.name)}
                        >
                          <div className="flex items-center gap-2">
                            {localSelectedTools.includes(tool.name) && <CheckCircle2 className="w-4 h-4" />}
                            {tool.name}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full py-3 rounded-xl font-loos-wide bg-orange text-black"
                  onClick={handleSaveTools}
                >
                  Save Tools
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ToolsPage;