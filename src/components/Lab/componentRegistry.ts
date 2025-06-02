import AnimatedCardsCarousel from "./Experiments/animatedCardsCarousel";

export const componentRegistry = {
  AnimatedCardsCarousel,
} as const;

export type ComponentKey = keyof typeof componentRegistry;
