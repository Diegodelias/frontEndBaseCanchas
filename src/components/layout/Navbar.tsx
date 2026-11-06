import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';
import { BrandWordmark } from '../ui/BrandWordmark';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../theme/ThemeToggle';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { authMode, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to={ROUTES.HOME}
          aria-label="Canchas3 Inicio"
          className="inline-flex items-center shrink-0 py-1"
        >
          <BrandWordmark tone="light" />
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Navegación del sitio"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-muted"
        >
          <Link
            to={ROUTES.HOME}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              isActive(ROUTES.HOME) ? 'text-ink font-semibold' : 'hover:text-ink'
            }`}
          >
            Inicio
          </Link>

          <Link
            to={ROUTES.LIVE}
            className={`inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              isActive(ROUTES.LIVE) ? 'text-ink font-semibold' : 'hover:text-ink'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            <span>En vivo</span>
          </Link>

          <Link
            to={ROUTES.SEARCH}
            className={`inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              isActive(ROUTES.SEARCH) ? 'text-ink font-semibold' : 'hover:text-ink'
            }`}
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Buscar partido</span>
          </Link>

          <Link
            to={ROUTES.PROFILE}
            className={`inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              isActive(ROUTES.PROFILE) ? 'text-ink font-semibold' : 'hover:text-ink'
            }`}
          >
            <User className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Mi perfil {authMode === 'registered' && user ? `(${user.name.split(' ')[0]})` : ''}</span>
          </Link>
        </nav>

        {/* Zone 3: Action */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link to={ROUTES.SEARCH}>
            <Button variant="volt" size="sm" className="hidden sm:inline-flex">
              <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Ver grabaciones</span>
            </Button>
          </Link>

          <div className="theme-toggle-container flex items-center justify-center shrink-0 self-center my-auto sm:ml-0.5">
            <ThemeToggle />
          </div>

          <Link to={ROUTES.PROFILE} className="sm:hidden">
            <button
              type="button"
              aria-label="Ver mi perfil"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg border border-line text-ink hover:bg-surface-muted"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </button>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg border border-line text-ink hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-surface px-4 py-4 space-y-3">
          <nav aria-label="Navegación móvil" className="flex flex-col space-y-1">
            <Link
              to={ROUTES.HOME}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center text-base font-medium text-ink hover:text-turf"
            >
              Inicio
            </Link>
            <Link
              to={ROUTES.LIVE}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center text-base font-medium text-ink hover:text-turf gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span>Canchas en vivo</span>
            </Link>
            <Link
              to={ROUTES.SEARCH}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center text-base font-medium text-ink hover:text-turf"
            >
              Buscar partido y ver grabación
            </Link>
            <Link
              to={ROUTES.PROFILE}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center text-base font-medium text-ink hover:text-turf"
            >
              Mi perfil y jugadas guardadas
            </Link>
          </nav>

          <div className="pt-3 border-t border-line flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Tema visual</span>
            <div className="theme-toggle-container flex items-center shrink-0 self-center my-auto">
              <ThemeToggle variant="switch" showLabel />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
