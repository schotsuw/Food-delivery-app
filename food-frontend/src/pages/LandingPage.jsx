
import { Outlet } from 'react-router';
import Hero from '../components/Hero';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      <Outlet/>
      <Hero />
    </div>
  );
}