import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';

const MainLayout = () => (
  <SiteSettingsProvider>
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  </SiteSettingsProvider>
);

export default MainLayout;
