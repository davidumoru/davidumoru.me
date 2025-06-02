import AnimatedCardsCarousel from "./Experiments/animatedCardsCarousel";
import HoveringProfiles from "./Experiments/hoveringProfiles";

export const componentRegistry = {
  AnimatedCardsCarousel,
  HoveringProfiles,
} as const;

export type ComponentKey = keyof typeof componentRegistry;
