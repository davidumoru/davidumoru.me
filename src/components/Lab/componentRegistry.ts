import AnimatedCardsCarousel from "./Experiments/animated-cards-carousel";
import HoveringProfiles from "./Experiments/hovering-profiles";
import StackedAvatars from "./Experiments/stacked-avatars";
import PillButton from "./Experiments/pill-button";
import SwipeableCardStack from "./Experiments/swipeable-card-stack";
import AnimatedTabs from "./Experiments/animated-tabs"

export const componentRegistry = {
  AnimatedCardsCarousel,
  HoveringProfiles,
  StackedAvatars,
  PillButton,
  SwipeableCardStack,
  AnimatedTabs,
} as const;

export type ComponentKey = keyof typeof componentRegistry;
