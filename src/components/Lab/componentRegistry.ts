import AnimatedCardsCarousel from "./Experiments/AnimatedCardsCarousel";
import HoveringProfiles from "./Experiments/HoveringProfiles";
import StackedAvatars from "./Experiments/StackedAvatars"

export const componentRegistry = {
  AnimatedCardsCarousel,
  HoveringProfiles,
  StackedAvatars,
} as const;

export type ComponentKey = keyof typeof componentRegistry;
