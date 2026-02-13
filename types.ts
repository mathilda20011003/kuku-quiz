
export type Step = 'COVER' | 'INPUTS' | 'QUIZ' | 'LOADING' | 'RESULT';

export interface QuizQuestion {
  id: number;
  text: string;
  highlightWord?: string;
  options: {
    label: string;
    score: number;
  }[];
}

export interface UserInputs {
  nickname: string;
  partnerName: string;
  userGender?: string;
  partnerGender?: string;
}

export interface QuizResult {
  title: string;
  duoName: string;
  image: string;
  description: string;
}
