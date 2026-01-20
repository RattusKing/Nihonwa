import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { JLPT_LEVEL_INFO } from '../utils/jlptHelpers';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useStore();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-colors';
    return isActive(path)
      ? `${base} bg-n4 text-white`
      : `${base} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-n4">
                日本話 Nihonwa
              </Link>
              {user && (
                <span className={`badge-${user.currentLevel.toLowerCase()}`}>
                  {JLPT_LEVEL_INFO[user.currentLevel].name}
                </span>
              )}
            </div>

            <nav className="flex items-center gap-2">
              <Link to="/" className={navLinkClass('/')}>
                Dashboard
              </Link>
              <Link to="/immersion" className={navLinkClass('/immersion')}>
                Immersion
              </Link>
              <Link to="/progress" className={navLinkClass('/progress')}>
                Progress
              </Link>
              <Link to="/settings" className={navLinkClass('/settings')}>
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Nihonwa - Your journey from N5 to N1</p>
        </div>
      </footer>
    </div>
  );
}
