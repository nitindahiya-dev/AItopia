import Link from 'next/link';
import dynamic from 'next/dynamic';
import Packages from '../components/Packages';
import ProductRoadmap from '../components/ProductRoadmap';
import TeamNetwork from '../components/TeamNetwork';
import LiveAnalytics from '../components/LiveAnalytics';
import OurMarquee from '../components/OurMarquee';

const Scene = dynamic(() => import('../components/Scene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

const Home = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-screen md:w-full">
        <div className="absolute md:mt-6 inset-0 -z-10">
          <Scene />
        </div>
        <div className="relative overflow-x-hidden z-10 md:w-[70vw] text-center h-screen mr-2 md:mx-auto flex flex-col items-center justify-center gap-3 md:gap-7">
          <h1 className="uppercase text-4xl md:text-8xl font-bold font-loos-wide ">the progressors</h1>
          <p className="text-xl md:text-3xl font-aeroport text-gray-200">Upgrade yourself and everything around - be a trailblazer!</p>
          <Link className="bg-[#f59e0b] text-black font-bold px-5 py-3 rounded-full w-44 hover:bg-opacity-90 transition-all" href="/tools">Try Now</Link>
        </div>
      </div>

      <ProductRoadmap />
      <LiveAnalytics />
      <TeamNetwork />
      {/* <FAQ /> */}
      <Packages />
      <div className="hidden md:inline-block">
        <OurMarquee />
      </div>

    </div>
  );
};

export default Home;