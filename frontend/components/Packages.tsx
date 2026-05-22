import { useState } from 'react';
import { Rocket, Sparkles, Wallet, BadgeCheck, Zap, Crown } from 'lucide-react';

const Packages = () => {
  const [selectedPackage, setSelectedPackage] = useState('pro');

    // Get current date information
    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const formattedDate = lastDayOfMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });

  const packages = [
    {
      name: 'Starter',
      price: 0,
      tools: 3,
      features: [
        'Basic AI Tools Access',
        'Community Support',
        '5 Monthly Credits'
      ],
      icon: <Zap className="w-8 h-8" />,
      gradient: 'from-blue-500/20 to-purple-500/20'
    },
    {
      name: 'Pro',
      price: 19,
      tools: 5,
      features: [
        'All Pro Tools',
        'Priority Support',
        '100 Monthly Credits',
        'Early Access Features'
      ],
      icon: <Rocket className="w-8 h-8" />,
      gradient: 'from-orange-500/20 to-red-500/20',
      recommended: true
    },
    {
      name: 'Unlimited',
      price: 29,
      tools: 'All',
      features: [
        'Full Tool Access',
        '24/7 Priority Support',
        'Unlimited Credits',
        'Premium Templates',
        'Team Access'
      ],
      icon: <Crown className="w-8 h-8" />,
      gradient: 'from-purple-500/20 to-pink-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20">
        <div className="grid md:grid-cols-1 gap-8">

          <div className="md:col-span-3 space-y-12">
            {/* Package Selector */}
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.name}
                  className={`relative backdrop-blur-lg border rounded-3xl p-8 cursor-pointer transition-all 
                    ${selectedPackage === pkg.name.toLowerCase() 
                      ? 'border-orange bg-orange/10' 
                      : 'border-white/10 hover:border-orange/30'}
                    ${pkg.gradient}`}
                  onClick={() => setSelectedPackage(pkg.name.toLowerCase())}
                >
                  {pkg.recommended && (
                    <div className="absolute top-0 right-0 bg-orange text-black px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-loos-wide">
                      POPULAR
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-orange/20 rounded-xl text-orange">
                      {pkg.icon}
                    </div>
                    <div>
                      <h3 className="font-loos-wide text-2xl">{pkg.name}</h3>
                      <p className="font-aeroport text-orange">
                        {pkg.price === 0 ? 'Free Forever' : `$${pkg.price}/mo`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange" />
                      <span className="font-loos-wide">
                        {typeof pkg.tools === 'number' ? `${pkg.tools}+ Tools` : 'All Tools'}
                      </span>
                    </div>

                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <BadgeCheck className="w-5 h-5 text-orange" />
                        <span className="font-aeroport text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className={`w-full mt-8 py-3 rounded-xl transition-all ${
                    selectedPackage === pkg.name.toLowerCase()
                      ? 'bg-orange text-black hover:bg-orange/90'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}>
                    {pkg.price === 0 ? 'Current Plan' : 'Choose Plan'}
                  </button>
                </div>
              ))}
            </div>

            {/* Progress & Usage */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="font-loos-wide text-2xl text-orange mb-6">Your Progress</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between font-aeroport text-white/80">
                    <span>Tools Used</span>
                    <span>2/3 (Starter Plan)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-orange h-2 rounded-full transition-all" 
                      style={{ width: `${(2/3)*100}%` }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-orange">
                      <Wallet className="w-6 h-6" />
                      <span className="font-loos-wide">Next Payment</span>
                    </div>
                    <p className="font-aeroport text-white/80">
                      $0.00 - {formattedDate}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-orange">
                      <Sparkles className="w-6 h-6" />
                      <span className="font-loos-wide">Remaining Credits</span>
                    </div>
                    <p className="font-aeroport text-white/80">
                      3/5 Credits (60% remaining)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Gallery */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="font-loos-wide text-2xl text-orange mb-6">AI Tool Gallery</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {['Artisan AI', 'VoiceCraft', 'LingoSync', 'NeuroChat', 'PixelGen'].map((tool, index) => (
                  <div 
                    key={index}
                    className="group p-6 border border-white/10 rounded-xl hover:border-orange/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange/20 rounded-lg text-orange">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="font-loos-wide">{tool}</h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-aeroport text-white/80 text-sm">
                        {index < 3 ? 'Included in Free' : 'Pro+ Only'}
                      </span>
                      {index >= 3 && (
                        <span className="px-3 py-1 bg-orange/20 text-orange rounded-full text-sm">
                          Upgrade
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Packages;