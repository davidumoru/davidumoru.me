import AnimatedCardsCarousel from "./Experiments/AnimatedCardsCarousel";
import HoveringProfiles from "./Experiments/HoveringProfiles";
import StackedAvatars from "./Experiments/StackedAvatars";
import PillButton from "./Experiments/PillButton";

export const componentRegistry = {
  AnimatedCardsCarousel,
  HoveringProfiles,
  StackedAvatars,
  PillButton,
} as const;

export type ComponentKey = keyof typeof componentRegistry;
