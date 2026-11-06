import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookingModal } from './components/modals/BookingModal';
import { OwnerInquiryModal } from './components/modals/OwnerInquiryModal';
import { PlaceholderInfoModal } from './components/modals/PlaceholderInfoModal';
import { ComplexOwnersSection } from './components/sections/ComplexOwnersSection';
import { FaqSection } from './components/sections/FaqSection';
import {
  FeaturedComplexesSection,
  SportFilterOption,
} from './components/sections/FeaturedComplexesSection';
import { FinalCtaAndFooter } from './components/sections/FinalCtaAndFooter';
import { Header } from './components/sections/Header';
import { HeroSearchSection } from './components/sections/HeroSearchSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { PlayerBenefitsSection } from './components/sections/PlayerBenefitsSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { PLACEHOLDER_MODALS } from './data/landingContent';
import { MOCK_CITIES, MOCK_COMPLEXES } from './data/mockComplexes';
import {
  Complex,
  PlaceholderModalInfo,
  SearchSelection,
} from './types/canchas';

const SKELETON_DURATION_MS = 340;

export function App() {
  const [selectedCityId, setSelectedCityId] = useState<string>(
    MOCK_CITIES[0]?.id ?? 'buenos-aires'
  );
  const [sportFilter, setSportFilter] = useState<SportFilterOption>('Todos');
  const [activeSearch, setActiveSearch] = useState<SearchSelection | null>(
    null
  );
  const [isLoadingComplexes, setIsLoadingComplexes] = useState<boolean>(false);

  const [bookingComplex, setBookingComplex] = useState<Complex | null>(null);
  const [ownerModalOpen, setOwnerModalOpen] = useState<boolean>(false);
  const [placeholderModal, setPlaceholderModal] =
    useState<PlaceholderModalInfo | null>(null);

  const skeletonTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (skeletonTimeoutRef.current !== null) {
        window.clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, []);

  const triggerBriefSkeleton = () => {
    if (skeletonTimeoutRef.current !== null) {
      window.clearTimeout(skeletonTimeoutRef.current);
    }
    setIsLoadingComplexes(true);
    skeletonTimeoutRef.current = window.setTimeout(() => {
      setIsLoadingComplexes(false);
    }, SKELETON_DURATION_MS);
  };

  const activeCity = useMemo(
    () =>
      MOCK_CITIES.find((c) => c.id === selectedCityId) ?? MOCK_CITIES[0],
    [selectedCityId]
  );

  const cityComplexes = useMemo(
    () => MOCK_COMPLEXES.filter((c) => c.city === selectedCityId),
    [selectedCityId]
  );

  const visibleComplexes = useMemo(() => {
    if (activeSearch) {
      return cityComplexes.filter((c) => c.id === activeSearch.complexId);
    }
    if (sportFilter === 'Todos') {
      return cityComplexes;
    }
    return cityComplexes.filter((c) => c.sports.includes(sportFilter));
  }, [cityComplexes, activeSearch, sportFilter]);

  const scrollToElement = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCityChange = (nextCityId: string) => {
    setSelectedCityId(nextCityId);
    setActiveSearch(null);
    setSportFilter('Todos');
    triggerBriefSkeleton();
  };

  const handleSearchSubmit = (selection: SearchSelection) => {
    setActiveSearch(selection);
    setSportFilter('Todos');
    triggerBriefSkeleton();
    scrollToElement('complejos');
  };

  const handleSportFilterChange = (nextFilter: SportFilterOption) => {
    setActiveSearch(null);
    setSportFilter(nextFilter);
    triggerBriefSkeleton();
  };

  const handleClearSearch = () => {
    setActiveSearch(null);
    triggerBriefSkeleton();
  };

  const handleResetToDefaultCity = () => {
    const defaultCityId = MOCK_CITIES[0]?.id ?? 'buenos-aires';
    setSelectedCityId(defaultCityId);
    setActiveSearch(null);
    setSportFilter('Todos');
    triggerBriefSkeleton();
  };

  const handleFindNextCourt = () => {
    scrollToElement('buscador');
    window.setTimeout(() => {
      document.getElementById('search-complex')?.focus();
    }, 350);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* 1. Header */}
      <Header
        cities={MOCK_CITIES}
        selectedCityId={selectedCityId}
        onSelectCity={handleCityChange}
        onReserveNowClick={() => scrollToElement('complejos')}
        onLoginClick={() => setPlaceholderModal(PLACEHOLDER_MODALS.ingresar)}
      />

      <main className="flex-1">
        {/* 2. Hero + Buscador en cascada */}
        <HeroSearchSection
          complexes={cityComplexes}
          activeCityName={activeCity?.name ?? 'Buenos Aires'}
          onSearchSubmit={handleSearchSubmit}
          onPrimaryCta={() => scrollToElement('complejos')}
          onOwnerCta={() => setOwnerModalOpen(true)}
        />

        {/* 3. Complejos destacados / cerca tuyo */}
        <FeaturedComplexesSection
          complexes={visibleComplexes}
          activeCityName={activeCity?.name ?? 'Buenos Aires'}
          sportFilter={sportFilter}
          onSportFilterChange={handleSportFilterChange}
          activeSearch={activeSearch}
          onClearSearch={handleClearSearch}
          onResetToDefaultCity={handleResetToDefaultCity}
          onOpenOwnerModal={() => setOwnerModalOpen(true)}
          onOpenBooking={(complex) => setBookingComplex(complex)}
          isLoading={isLoadingComplexes}
        />

        {/* 4. Cómo funciona */}
        <HowItWorksSection
          onPrimaryCta={() => scrollToElement('complejos')}
        />

        {/* 5. Beneficios para jugadores */}
        <PlayerBenefitsSection
          onPrimaryCta={() => scrollToElement('complejos')}
        />

        {/* 6. Para complejos deportivos */}
        <ComplexOwnersSection
          onOpenOwnerModal={() => setOwnerModalOpen(true)}
        />

        {/* 7. Testimonios */}
        <TestimonialsSection />

        {/* 8. Preguntas frecuentes (FAQ) */}
        <FaqSection />
      </main>

      {/* 9. CTA Final y Footer */}
      <FinalCtaAndFooter
        onFindCourtClick={handleFindNextCourt}
        onOwnerClick={() => setOwnerModalOpen(true)}
        onPlaceholderClick={(key) =>
          setPlaceholderModal(PLACEHOLDER_MODALS[key])
        }
      />

      {/* Modales interactivos simulados */}
      <BookingModal
        complex={bookingComplex}
        initialSelection={
          activeSearch && bookingComplex?.id === activeSearch.complexId
            ? activeSearch
            : undefined
        }
        onClose={() => setBookingComplex(null)}
      />

      <OwnerInquiryModal
        isOpen={ownerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
      />

      <PlaceholderInfoModal
        info={placeholderModal}
        onClose={() => setPlaceholderModal(null)}
      />
    </div>
  );
}

export default App;
