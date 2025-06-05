import AnimatedCardsCarousel from "./Experiments/AnimatedCardsCarousel";
import HoveringProfiles from "./Experiments/HoveringProfiles";

export const componentRegistry = {
  AnimatedCardsCarousel,
  HoveringProfiles,
} as const;

export type ComponentKey = keyof typeof componentRegistry;
