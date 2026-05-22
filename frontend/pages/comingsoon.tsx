import { Rocket, Mail, Twitter, Github } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ComingSoon = () => {
  // Initialize target date to 14 days from now.
  const [targetDate, setTargetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState({
    days: '14',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      let difference = targetDate.getTime() - now;

      // When timer reaches zero, reset target date for another 14 days.
      if (difference < 0) {
        const newTarget = new Date();
        newTarget.setDate(newTarget.getDate() + 14);
        setTargetDate(newTarget);
        // Recompute difference using the new target.
        difference = newTarget.getTime() - now;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 text-center">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 space-y-12">
          {/* Animated Icon */}
          <div className="animate-float mx-auto">
            <Rocket className="w-24 h-24 text-orange mx-auto" />
          </div>

          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl text-orange">
            Launching Soon
          </h1>

          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            {`We're`} cooking up something extraordinary! Be the first to experience our next-generation AI tools.
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4">
            <TimeBlock value={timeLeft.days} label="Days" />
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <TimeBlock value={timeLeft.minutes} label="Minutes" />
            <TimeBlock value={timeLeft.seconds} label="Seconds" />
          </div>

          {/* Newsletter Form */}
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-orange"
              />
              <button className="bg-orange text-black font-loos-wide px-8 py-4 rounded-xl hover:bg-orange/80 transition-all">
                Notify Me
              </button>
            </div>

            <div className="flex justify-center gap-6">
              <SocialIcon icon={<Twitter className="w-6 h-6" />} />
              <Link href="https://github.com/nitindahiya-dev/AItopia" target="_blank">
                <SocialIcon icon={<Github className="w-6 h-6" />} />
              </Link>
              <SocialIcon icon={<Mail className="w-6 h-6" />} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const TimeBlock = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="font-loos-wide text-4xl md:text-5xl text-white bg-white/5 p-6 rounded-xl">
      {value}
    </div>
    <span className="font-aeroport text-white/60 mt-2 block">{label}</span>
  </div>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-orange hover:border-orange/20 transition-all">
    {icon}
  </button>
);

export default ComingSoon;
