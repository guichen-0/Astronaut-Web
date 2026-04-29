import { create } from "zustand";

interface StarMapState {
  selectedStarId: string | null;
  highlightedStarId: string | null;
  magnitudeLimit: number;
  showConstellations: boolean;
  showGrid: boolean;
  showLabels: boolean;

  setSelectedStar: (id: string | null) => void;
  setHighlightedStar: (id: string | null) => void;
  setMagnitudeLimit: (limit: number) => void;
  setShowConstellations: (show: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setShowLabels: (show: boolean) => void;
}

export const useStarMap = create<StarMapState>((set) => ({
  selectedStarId: null,
  highlightedStarId: null,
  magnitudeLimit: 6,
  showConstellations: true,
  showGrid: false,
  showLabels: true,

  setSelectedStar: (id) => set({ selectedStarId: id }),
  setHighlightedStar: (id) => set({ highlightedStarId: id }),
  setMagnitudeLimit: (limit) => set({ magnitudeLimit: limit }),
  setShowConstellations: (show) => set({ showConstellations: show }),
  setShowGrid: (show) => set({ showGrid: show }),
  setShowLabels: (show) => set({ showLabels: show }),
}));
