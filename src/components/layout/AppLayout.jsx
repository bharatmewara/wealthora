import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import StickyEnquiryCTA from '../StickyEnquiryCTA';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <StickyEnquiryCTA />
    </div>
  );
}