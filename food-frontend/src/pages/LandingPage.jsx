
import { Outlet } from 'react-router';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      <Outlet/>
      <Hero />
      <AboutSection/>
    </div>
  );
}