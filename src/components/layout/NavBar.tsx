import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', icon: 'home', label: 'Accueil' },
  { path: '/history', icon: 'history', label: 'Historique' },
  { path: '/stats', icon: 'analytics', label: 'Stats' },
  { path: '/settings', icon: 'settings', label: 'Réglages' },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ne pas afficher la navbar sur les écrans de match
  const hideNavBar = ['/setup', '/tracking', '/summary'].includes(location.pathname);

  if (hideNavBar) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-white/10 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-1">
                  {item.icon}
                </span>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
