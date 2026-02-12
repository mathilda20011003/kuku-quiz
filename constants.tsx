
import { QuizQuestion, QuizResult } from './types';

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 2,
    text: "How did you first meet?",
    highlightWord: "meet",
    options: [
      { label: "Same social circle", score: 1 },
      { label: "School or work", score: 2 },
      { label: "Online or app", score: 3 },
      { label: "Completely unexpected", score: 4 },
    ]
  },
  {
    id: 3,
    text: "How long have you known each other",
    highlightWord: "known",
    options: [
      { label: "Just started", score: 1 },
      { label: "Few months in", score: 2 },
      { label: "Over a year", score: 3 },
      { label: "On and off", score: 4 },
    ]
  },
  {
    id: 4,
    text: "Your relationship vibe is mostly…",
    highlightWord: "vibe",
    options: [
      { label: "Soft and steady", score: 2 },
      { label: "Intense and dramatic", score: 1 },
      { label: "Fun but chaotic", score: 3 },
      { label: "Quietly complicated", score: 4 },
    ]
  },
  {
    id: 5,
    text: "When conflict happens, you usually…",
    highlightWord: "conflict",
    options: [
      { label: "Fight, then reconnect", score: 2 },
      { label: "Talk it through", score: 3 },
      { label: "Avoid the topic", score: 1 },
      { label: "Emotions explode", score: 4 },
    ]
  },
  {
    id: 6,
    text: "Who leads the dynamic?",
    highlightWord: "dynamic",
    options: [
      { label: "Mostly me", score: 2 },
      { label: "Mostly them", score: 3 },
      { label: "Power shifts", score: 1 },
      { label: "True equals", score: 4 },
    ]
  },
  {
    id: 7,
    text: "Since being with them, you feel…",
    highlightWord: "feel",
    options: [
      { label: "More myself", score: 1 },
      { label: "A better version", score: 2 },
      { label: "Less independent", score: 3 },
      { label: "Emotionally fused", score: 4 },
    ]
  },
  {
    id: 8,
    text: "How do you show affection?",
    highlightWord: "affection",
    options: [
      { label: "Physical closeness", score: 1 },
      { label: "Words and reassurance", score: 2 },
      { label: "Jokes and teasing", score: 3 },
      { label: "Acts of support", score: 4 },
    ]
  },
  {
    id: 9,
    text: "If they don't text back…",
    highlightWord: "text",
    options: [
      { label: "I spiral quietly", score: 1 },
      { label: "I give space", score: 2 },
      { label: "I overthink", score: 3 },
      { label: "I don't care", score: 4 },
    ]
  },
  {
    id: 10,
    text: "Your favorite moments together are…",
    highlightWord: "moments",
    options: [
      { label: "Deep late talks", score: 1 },
      { label: "Being seen out", score: 2 },
      { label: "Laughing nonstop", score: 3 },
      { label: "Intense emotional highs", score: 4 },
    ]
  }
];

export const RESULTS: Record<number, QuizResult> = {
  1: {
    title: "The Chaos Crew",
    duoName: "Wednesday & Enid",
    image: "https://images.unsplash.com/photo-1674488970979-373950d885a0?q=80&w=1000&auto=format&fit=crop",
    description: "You two are the definition of 'opposites attract'. One is a brooding mysterious soul, the other is sunshine and rainbows. Yet, you're inseparable!"
  },
  2: {
    title: "The Iconic Besties",
    duoName: "Samantha & Miranda",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop",
    description: "Just like Samantha and Miranda in Sex and the City, you two are absolutely the perfect friends. One of you is like summer, and another is like autumn."
  },
  3: {
    title: "The Soulmates",
    duoName: "Ross & Rachel",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    description: "A rollercoaster of emotions, but everyone knows you're meant to be. Your chemistry is off the charts and your history is legendary."
  },
  4: {
    title: "The Partners in Crime",
    duoName: "Joey & Chandler",
    image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=1000&auto=format&fit=crop",
    description: "Brotherhood or soulmates? Who knows! You share everything from pizza to life's biggest dilemmas. Your bond is unbreakable."
  }
};
