import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { allTools, categories } from '../utils/toolsData';

const CategoriesPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { category: queryCategory } = router.query;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync selectedCategory with queryCategory when route changes
  useEffect(() => {
    if (typeof queryCategory === 'string' && categories.includes(queryCategory)) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [queryCategory]);

  const subscription =
    user?.subscription && typeof user.subscription === 'object'
      ? user.subscription
      : null;
  const hasSubscription = subscription?.status === 'active';
  const purchasedTools = subscription?.selectedTools ?? [];

  const filteredTools = hasSubscription && purchasedTools.length > 0
    ? allTools.filter((tool) => purchasedTools.includes(tool.name))
    : allTools
        .filter((tool) => selectedCategory === 'all' || tool.category === selectedCategory)
        .filter((tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="uppercase font-loos-wide text-4xl md:text-6xl xl:text-7xl font-bold text-orange"
          >
            Tool Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
          >
            Explore our AI tools by category to find the perfect solution for your needs.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-white/5 rounded-xl w-full md:w-1/2 mb-6 border border-white/10 focus:outline-none focus:border-orange"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                router.push(`/categories?category=${encodeURIComponent(category)}`, undefined, {
                  shallow: true,
                });
              }}
              className={`px-6 py-2 rounded-xl font-loos-wide transition-all ${
                selectedCategory === category
                  ? 'bg-orange text-black'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTools.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="font-aeroport text-white/80">
                {hasSubscription
                  ? 'No tools selected in this category. Manage your tools to add some!'
                  : 'No tools match your search or category.'}
              </p>
              {hasSubscription && (
                <Link
                  href="/dashboard"
                  className="inline-block mt-4 bg-orange text-black px-6 py-2 rounded-xl hover:bg-amber-500 transition-all"
                >
                  Manage Tools
                </Link>
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
      </main>
    </div>
  );
};

export default CategoriesPage;