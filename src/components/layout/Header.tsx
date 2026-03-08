import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('Home', 'الرئيسية') },
    { path: '/properties', label: t('Properties', 'المشاريع') },
    { path: '/about', label: t('About Us', 'من نحن') },
    { path: '/contact', label: t('تواصل معنا', 'Contact') },
  ];

  // Fix: contact labels were swapped
  navItems[3].label = t('Contact', 'تواصل معنا');

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container-premium flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
          <span className="text-gradient-gold">AWTAD</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="rounded-md border border-border px-3 py-1.5 font-body text-xs font-semibold tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {language === 'en' ? 'عربي' : 'EN'}
          </button>

          {/* CTA */}
          <Link
            to="/contact"
            className="hidden rounded-md bg-gradient-gold px-5 py-2.5 font-body text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 md:inline-block"
          >
            {t('Register Interest', 'سجل اهتمامك')}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background md:hidden"
          >
            <nav className="container-premium flex flex-col gap-4 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-base font-medium transition-colors ${
                    isActive(item.path) ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-md bg-gradient-gold px-5 py-3 text-center font-body text-sm font-semibold text-primary-foreground"
              >
                {t('Register Interest', 'سجل اهتمامك')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
