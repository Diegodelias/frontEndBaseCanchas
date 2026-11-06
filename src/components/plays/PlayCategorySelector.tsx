import React from 'react';
import { PLAY_CATEGORIES, PlayCategory } from '../../types/play';

interface PlayCategorySelectorProps {
  selectedCategory?: PlayCategory;
  onSelectCategory: (category?: PlayCategory) => void;
}

export const PlayCategorySelector: React.FC<PlayCategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
          Clasificación (opcional)
        </label>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className="text-[11px] font-semibold text-turf hover:underline cursor-pointer"
          >
            Quitar
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {PLAY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(isSelected ? undefined : cat)}
              aria-pressed={isSelected}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-volt text-volt-ink font-bold ring-1 ring-volt shadow-xs'
                  : 'bg-surface border border-line text-ink hover:bg-surface-muted hover:border-line-strong'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
