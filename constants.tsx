
import { QuizQuestion, QuizResult } from './types';

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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

// All possible results
export const ALL_RESULTS: Record<string, QuizResult> = {
  // POOL_MF (Mixed / Universal)
  "MF_01": {
    title: "Male-Female Duo",
    duoName: "Justin Trudeau × Katy Perry",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Justin+Trudeau+%C3%97+Katy+Perry.jpg",
    description: "You make **diplomacy** look like a concert. He posts ski pics, you post smiles, and the internet collectively loses it."
  },
  "MF_02": {
    title: "Male-Female Duo",
    duoName: "Taylor Swift × Trump",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Taylor+Swift+%C3%97+Trump.jpg",
    description: "This relationship runs on headlines. One posts lyrics, the other posts rants, and somehow it still **trends**."
  },
  "MF_03": {
    title: "Male-Female Duo",
    duoName: "Kim Kardashian × Louis Hamilton",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Kim+Kardashian+%C3%97+Louis+Hamilton.jpg",
    description: "You race between **paparazzi** flashes and fashion weeks like it's a sport. Glamour plus speed equals legendary fuel."
  },
  "MF_04": {
    title: "Mixed Duo",
    duoName: "Barbie × Oppenheimer",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Barbie+%C3%97+Oppenheimer.jpg",
    description: "One of you says **Hi Barbie**, the other **overthinks** the universe. Somehow you still build your own world together."
  },
  "MF_05": {
    title: "Male-Female Duo",
    duoName: "Damon × Elena",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Damon+%C3%97+Elena.jpg",
    description: "You **fight**, you **flirt**, you ruin each other's lives a little. Drama is your love language."
  },
  "MF_06": {
    title: "Male-Female Duo",
    duoName: "Mike × Eleven",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Mike+%C3%97+Eleven.jpg",
    description: "You believed in each other before anyone else did. You'd bike across **dimensions** for each other."
  },
  "MF_07": {
    title: "Male-Female Duo",
    duoName: "Jim × Pam",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Jim+%C3%97+Pam.jpg",
    description: "You flirt like coworkers and love like best friends. **Slow burn**, inside jokes, forever energy."
  },
  "MF_08": {
    title: "Male-Female Duo",
    duoName: "Joe × Love",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Joe+%C3%97+Love.jpg",
    description: "You say I'd do anything for you and actually mean it. You think you're the normal one. Plot twist, you're both **insane** for love."
  },
  "MF_09": {
    title: "Male-Female Duo",
    duoName: "Marianne × Connell",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Marianne+%C3%97+Connell.jpg",
    description: "You text paragraphs you never send. Intimacy lives in what's **unsaid** between you."
  },
  
  // POOL_FF (Female / Female)
  "FF_01": {
    title: "Female-Female Duo",
    duoName: "Sabrina Carpenter × Taylor Swift",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Sabrina+Carpenter+%C3%97+Taylor+Swift.jpg",
    description: "One of you writes the bridge, the other runs the stadium. This friendship is strategic and **sentimental**."
  },
  "FF_02": {
    title: "Female-Female Duo",
    duoName: "Billie Eilish × Olivia Rodrigo",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Billie+Eilish+%C3%97+Olivia+Rodrigo.jpg",
    description: "One of you cries first, the other sends the playlist. You process everything loudly and **never judge** each other."
  },
  "FF_03": {
    title: "Female-Female Duo",
    duoName: "Rihanna × Beyoncé",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Rihanna+%C3%97+Beyonc%C3%A9.jpg",
    description: "This is **billionaire** energy. You woke up flawless and shine bright like diamonds. You celebrate wins, mind your business, and still **dominate** every room together."
  },
  "FF_04": {
    title: "Female-Female Duo",
    duoName: "Beyonce × Taylor Swift",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Beyonce+%C3%97+Taylor+Swift.jpg",
    description: "You let each other **shine** and still dominate the room. Supportive in public, unstoppable in private."
  },
  "FF_05": {
    title: "Female-Female Duo",
    duoName: "Blair × Serena",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Blair+%C3%97+Serena.jpg",
    description: "You **compete**, you forgive, you compete again. You're better together even when it's messy."
  },
  "FF_06": {
    title: "Female-Female Duo",
    duoName: "Casey × Izzie",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Casey+%C3%97+Izzie.jpg",
    description: "You make each other **brave**. You choose **authenticity** over comfort."
  },
  "FF_07": {
    title: "Female-Female Duo",
    duoName: "Devi × Eleanor",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Devi+%C3%97+Eleanor.jpg",
    description: "You hype each other **delusionally** and defend each other aggressively."
  },
  "FF_08": {
    title: "Female-Female Duo",
    duoName: "Maddy × Cassie",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Maddy+%C3%97+Cassie.jpg",
    description: "You love each other **loudly** and fight even louder. Jealousy, secrets, tears in the bathroom, but neither of you ever truly walks away."
  },
  "FF_09": {
    title: "Female-Female Duo",
    duoName: "Maeve × Aimee",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Maeve+%C3%97+Aimee.jpg",
    description: "You see each other at your worst and still stay. You **heal** in quiet ways. Honest conversations, gentle support, and the kind of friendship that makes you braver."
  },
  "FF_10": {
    title: "Female-Female Duo",
    duoName: "Rue × Jules",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Rue+%C3%97+Jules.jpg",
    description: "You love intensely and hurt deeply. **Magnetic**, messy, impossible to ignore."
  },
  
  // POOL_MM (Male / Male)
  "MM_01": {
    title: "Male-Male Duo",
    duoName: "Kanye West × Travis Scott",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Kanye+West+%C3%97+Travis+Scott.jpg",
    description: "You **remix** life like a beat. One brings chaos, the other brings vibe, and the world just bumps harder."
  },
  "MM_02": {
    title: "Male-Male Duo",
    duoName: "Trump × Bad Bunny",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Trump+%C3%97+Bad+Bunny.jpg",
    description: "One calls the show terrible, the other still trends worldwide. Your relationship is pure **contradiction**."
  },
  "MM_03": {
    title: "Male-Male Duo",
    duoName: "MrBeast × Thanos",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/MrBeast+%C3%97+Thanos.jpg",
    description: "You either give away islands or snap half the universe. Your friendship is either **philanthropy** or apocalypse."
  },
  "MM_04": {
    title: "Male-Male Duo",
    duoName: "Steve × Dustin",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Steve+%C3%97+Dustin.jpg",
    description: "You started as unlikely friends and ended as family. You **roast** each other daily but would fight monsters together."
  },
  "MM_05": {
    title: "Male-Male Duo",
    duoName: "Damon × Stefan",
    image: "https://kuku-quiz.s3.us-west-1.amazonaws.com/Damon+%C3%97+Stefan.jpg",
    description: "You fight over everything but always choose each other. Different paths, same blood, permanent **loyalty**."
  }
};

// Logic mapping for scoring
export const LOGIC_MAPPING = {
  POOL_MF: {
    Q1: { A: ["MF_03", "MF_01"], B: ["MF_07", "MF_09", "MF_02"], C: ["MF_08", "MF_05"], D: ["MF_06", "MF_04"] },
    Q2: { A: ["MF_04", "MF_01"], B: ["MF_03", "MF_08"], C: ["MF_07", "MF_06", "MF_05"], D: ["MF_09", "MF_02"] },
    Q3: { A: ["MF_07", "MF_06"], B: ["MF_05", "MF_08", "MF_02"], C: ["MF_04", "MF_01", "MF_03"], D: ["MF_09"] },
    Q4: { A: ["MF_05", "MF_04"], B: ["MF_07", "MF_06"], C: ["MF_09", "MF_01"], D: ["MF_02", "MF_08"] },
    Q5: { A: ["MF_02"], B: ["MF_06"], C: ["MF_04", "MF_05"], D: ["MF_03", "MF_08", "MF_07"] },
    Q6: { A: ["MF_07", "MF_05"], B: ["MF_03", "MF_06"], C: ["MF_09"], D: ["MF_08", "MF_02"] },
    Q7: { A: ["MF_05", "MF_09"], B: ["MF_06", "MF_01"], C: ["MF_07", "MF_04"], D: ["MF_03", "MF_08"] },
    Q8: { A: ["MF_08", "MF_09"], B: ["MF_07", "MF_06"], C: ["MF_05", "MF_04"], D: ["MF_03", "MF_02"] },
    Q9: { A: ["MF_09", "MF_06"], B: ["MF_03", "MF_01", "MF_04"], C: ["MF_07"], D: ["MF_05", "MF_08", "MF_02"] }
  },
  POOL_FF: {
    Q1: { A: ["FF_05", "FF_08"], B: ["FF_01", "FF_04", "FF_07"], C: ["FF_02"], D: ["FF_06", "FF_09", "FF_10"] },
    Q2: { A: ["FF_01"], B: ["FF_02", "FF_06"], C: ["FF_03", "FF_09", "FF_07"], D: ["FF_05", "FF_10", "FF_08"] },
    Q3: { A: ["FF_09", "FF_01"], B: ["FF_10", "FF_08", "FF_02"], C: ["FF_07", "FF_05"], D: ["FF_06", "FF_03"] },
    Q4: { A: ["FF_05", "FF_08"], B: ["FF_09", "FF_04"], C: ["FF_06", "FF_10"], D: ["FF_08", "FF_07"] },
    Q5: { A: ["FF_05"], B: ["FF_01"], C: ["FF_07", "FF_10"], D: ["FF_03", "FF_04", "FF_09"] },
    Q6: { A: ["FF_09", "FF_06"], B: ["FF_04", "FF_03", "FF_01"], C: ["FF_05"], D: ["FF_10", "FF_08", "FF_02"] },
    Q7: { A: ["FF_06", "FF_02"], B: ["FF_09", "FF_01"], C: ["FF_07", "FF_05"], D: ["FF_04", "FF_03"] },
    Q8: { A: ["FF_10", "FF_02"], B: ["FF_03", "FF_09"], C: ["FF_06", "FF_05"], D: ["FF_04", "FF_08"] },
    Q9: { A: ["FF_09", "FF_02"], B: ["FF_03", "FF_04", "FF_01"], C: ["FF_07"], D: ["FF_10", "FF_08", "FF_05"] }
  },
  POOL_MM: {
    Q1: { A: ["MM_01"], B: ["MM_04"], C: ["MM_03"], D: ["MM_02", "MM_05"] },
    Q2: { A: ["MM_02"], B: ["MM_01"], C: ["MM_05", "MM_04"], D: ["MM_03"] },
    Q3: { A: ["MM_04"], B: ["MM_05", "MM_01"], C: ["MM_02", "MM_04"], D: ["MM_03"] },
    Q4: { A: ["MM_05"], B: ["MM_04"], C: ["MM_02"], D: ["MM_01", "MM_03"] },
    Q5: { A: ["MM_03"], B: ["MM_01"], C: ["MM_04"], D: ["MM_05"] },
    Q6: { A: ["MM_04"], B: ["MM_01"], C: ["MM_05"], D: ["MM_03", "MM_02"] },
    Q7: { A: ["MM_05"], B: ["MM_01"], C: ["MM_04", "MM_02"], D: ["MM_03"] },
    Q8: { A: ["MM_05"], B: ["MM_04"], C: ["MM_01"], D: ["MM_02", "MM_03"] },
    Q9: { A: ["MM_05"], B: ["MM_03", "MM_02"], C: ["MM_04"], D: ["MM_01"] }
  }
};

// Legacy RESULTS for backward compatibility (will be replaced by new logic)
export const RESULTS: Record<number, QuizResult> = {
  1: ALL_RESULTS["MF_01"],
  2: ALL_RESULTS["FF_01"],
  3: ALL_RESULTS["MM_01"],
  4: ALL_RESULTS["MF_04"]
};
