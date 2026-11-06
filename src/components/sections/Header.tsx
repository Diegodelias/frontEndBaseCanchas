import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MapPin, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../data/landingContent';
import { CityOption } from '../../types/canchas';
import { BrandWordmark } from '../ui/BrandWordmark';
import { Button } from '../ui/Button';

interface HeaderProps {
  cities: CityOption[];
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
  onReserveNowClick: () => void;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cities,
  selectedCityId,
  onSelectCity,
  onReserveNowClick,
  onLoginClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          aria-label="Canchas3 Inicio"
          className="inline-flex items-center shrink-0 py-1"
        >
          <BrandWordmark tone="light" />
        </Link>

        {/* Zone 2: Desktop Navigation & Single Mock City Selector */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-ink-muted"
        >
          {NAV_LINKS.map((item) =>
            item.href.startsWith('/') ? (
              <Link
                key={item.href}
                to={item.href}
                className="hover:text-ink transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-ink transition-colors duration-150 whitespace-nowrap shrink-0 py-1"
              >
                {item.label}
              </a>
            )
          )}

          <span className="h-4 w-px bg-line shrink-0" aria-hidden="true" />

          <div className="relative inline-flex items-center text-ink shrink-0">
            <MapPin
              className="w-4 h-4 text-turf pointer-events-none shrink-0"
              aria-hidden="true"
            />
            <select
              aria-label="Ciudad"
              value={selectedCityId}
              onChange={(e) => onSelectCity(e.target.value)}
              className="appearance-none bg-transparent pl-1.5 pr-6 py-1.5 text-sm font-semibold text-ink cursor-pointer whitespace-nowrap focus:outline-none"
            >
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="w-3.5 h-3.5 text-ink-muted pointer-events-none -ml-4 shrink-0"
              aria-hidden="true"
            />
          </div>
        </nav>

        {/* Zone 3: Desktop Actions & Mobile Always-Visible CTA + Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onLoginClick}
            className="hidden lg:inline-flex items-center justify-center min-h-[40px] px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ingresar
          </button>

          <Button
            variant="volt"
            size="sm"
            onClick={onReserveNowClick}
            className="text-xs sm:text-sm"
          >
            Reservá ahora
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="lg:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-line text-ink hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-line bg-surface px-4 py-5 space-y-4"
        >
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-line">
            <label
              htmlFor="mobile-city-select"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              <MapPin className="w-3.5 h-3.5 text-turf" aria-hidden="true" />
              <span>Ciudad</span>
            </label>
            <select
              id="mobile-city-select"
              value={selectedCityId}
              onChange={(e) => {
                onSelectCity(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="min-h-[40px] px-3 py-1.5 rounded-lg border border-line-strong bg-canvas text-sm font-semibold text-ink"
            >
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.region})
                </option>
              ))}
            </select>
          </div>

          <nav aria-label="Navegación móvil" className="flex flex-col space-y-1">
            {NAV_LINKS.map((item) =>
              item.href.startsWith('/') ? (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleMobileNavClick}
                  className="min-h-[44px] flex items-center text-base font-medium text-ink hover:text-turf transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleMobileNavClick}
                  className="min-h-[44px] flex items-center text-base font-medium text-ink hover:text-turf transition-colors"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          <div className="pt-3 border-t border-line flex items-center gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
            >
              Ingresar
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
