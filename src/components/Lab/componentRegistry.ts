import AnimatedCardsCarousel from "./Experiments/AnimatedCardsCarousel";
import HoveringProfiles from "./Experiments/HoveringProfiles";
import StackedAvatars from "./Experiments/StackedAvatars";
import PillButton from "./Experiments/PillButton";
import SwipeableCardStack from "./Experiments/SwipeableCardStack";

export const componentRegistry = {
  AnimatedCardsCarousel,
  HoveringProfiles,
  StackedAvatars,
  PillButton,
  SwipeableCardStack,
} as const;

export type ComponentKey = keyof typeof componentRegistry;
