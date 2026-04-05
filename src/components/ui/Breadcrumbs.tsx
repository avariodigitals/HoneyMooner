import { Link, matchPath, useLocation } from 'react-router-dom';
import { ChevronRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const BREADCRUMB_ROUTE_PATTERNS = [
  '/',
  '/destinations',
  '/destinations/:slug',
  '/packages',
  '/packages/type/:slug',
  '/packages/:slug',
  '/journal',
  '/journal/:slug',
  '/about',
  '/contact',
  '/booking',
  '/faqs',
  '/account',
  '/account/wishlist'
];

function isExistingRoutePath(path: string): boolean {
  return BREADCRUMB_ROUTE_PATTERNS.some((pattern) =>
    Boolean(matchPath({ path: pattern, end: true }, path))
  );
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex section-container py-4 text-sm font-medium"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 md:space-x-4">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="text-brand-400 hover:text-brand-accent flex items-center transition-colors group"
          >
            <Heart size={14} className="mr-2 group-hover:fill-brand-accent transition-all" />
            <span>Home</span>
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const canNavigate = isExistingRoutePath(to);
          const label = value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <li key={to} className="flex items-center">
              <ChevronRight size={14} className="text-brand-200 mx-2 md:mx-4 shrink-0" />
              {last ? (
                <span className="text-brand-900 font-serif italic truncate max-w-[150px] md:max-w-none">
                  {label}
                </span>
              ) : canNavigate ? (
                <Link 
                  to={to} 
                  className="text-brand-400 hover:text-brand-accent transition-colors capitalize"
                >
                  {label}
                </Link>
              ) : (
                <span className="text-brand-300 capitalize cursor-default" aria-disabled="true">
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
};

export default Breadcrumbs;
