
import React, { useState, useRef } from 'react';
import { Step, UserInputs, QuizResult } from './types';
import { QUESTIONS, ALL_RESULTS, LOGIC_MAPPING } from './constants';
import html2canvas from 'html2canvas';

const MASCOT_IMG = "https://kuku-quiz.s3.us-west-1.amazonaws.com/kuku.png";

// Custom Pixel Badge Component matching the user's uploaded style
const PixelBadge = ({ text, className = "" }: { text: string, className?: string }) => (
  <div className={`relative inline-block ${className}`}>
    <div className="relative z-10 bg-[#b241b8] border-[3px] border-[#4cc9f0] px-3 py-1 flex items-center justify-center min-w-[60px] h-[40px] rounded-lg shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <span className="font-pixel text-white text-[12px] pt-1">{text}</span>
      {/* Speech Bubble Tail - Pixelated */}
      <div className="absolute -bottom-[8px] left-1/4 w-3 h-3 bg-[#b241b8] border-r-[3px] border-b-[3px] border-[#4cc9f0] rotate-45 z-0"></div>
    </div>
  </div>
);

export default function App() {
  const [step, setStep] = useState<Step>('COVER');
  const [inputs, setInputs] = useState<UserInputs>({ nickname: '', partnerName: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const startQuiz = () => setStep('INPUTS');
  
  const handleInputsSubmit = () => {
    if (inputs.nickname && inputs.partnerName) {
      setStep('QUIZ');
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, ['A', 'B', 'C', 'D'][optionIndex]];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      processResult(newAnswers);
    }
  };

  const processResult = (userAnswers: string[]) => {
    setStep('LOADING');
    setTimeout(() => {
      // Determine pool based on gender combination
      let targetPool: 'POOL_MF' | 'POOL_FF' | 'POOL_MM' = 'POOL_MF';
      
      const userGender = inputs.userGender || '';
      const partnerGender = inputs.partnerGender || '';
      
      if (userGender === 'Male' && partnerGender === 'Male') {
        targetPool = 'POOL_MM';
      } else if (userGender === 'Female' && partnerGender === 'Female') {
        targetPool = 'POOL_FF';
      } else if (userGender === 'Non-binary' || partnerGender === 'Non-binary') {
        targetPool = 'POOL_MF';
      } else {
        targetPool = 'POOL_MF';
      }
      
      // Get logic mapping for the target pool
      const poolLogic = LOGIC_MAPPING[targetPool];
      
      // Initialize scores for all results in this pool
      const scores: Record<string, number> = {};
      
      // Process each answer
      userAnswers.forEach((answer, index) => {
        const questionKey = `Q${index + 1}` as keyof typeof poolLogic;
        const questionLogic = poolLogic[questionKey];
        
        if (questionLogic && questionLogic[answer as 'A' | 'B' | 'C' | 'D']) {
          const resultIds = questionLogic[answer as 'A' | 'B' | 'C' | 'D'];
          
          resultIds.forEach(id => {
            scores[id] = (scores[id] || 0) + 1;
          });
        }
      });
      
      // Find the result with highest score
      let maxScore = 0;
      let winningId = '';
      
      Object.entries(scores).forEach(([id, score]) => {
        if (score > maxScore) {
          maxScore = score;
          winningId = id;
        }
      });
      
      // Fallback to first result if no winner found
      if (!winningId) {
        const poolPrefix = targetPool === 'POOL_MM' ? 'MM' : targetPool === 'POOL_FF' ? 'FF' : 'MF';
        winningId = `${poolPrefix}_01`;
      }
      
      // Set the result
      setResult(ALL_RESULTS[winningId]);
      setStep('RESULT');
    }, 2000);
  };

  const goBack = () => {
    if (step === 'INPUTS') setStep('COVER');
    else if (step === 'QUIZ') {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(prev => prev - 1);
          setAnswers(prev => prev.slice(0, -1));
        } else {
          setStep('INPUTS');
        }
    }
    else if (step === 'RESULT') setStep('COVER');
  };

  return (
    <div className="h-screen w-full relative flex flex-col items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: '#1a0b2e' }}>
      {/* Level -1: Blurred Background for Desktop */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div 
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: step === 'COVER'
              ? 'url(https://kuku-quiz.s3.us-west-1.amazonaws.com/homepage.png)' 
              : step === 'RESULT'
              ? 'url(https://kuku-quiz.s3.us-west-1.amazonaws.com/result%20background.png)'
              : 'url(https://kuku-quiz.s3.us-west-1.amazonaws.com/quzi%20backgroud.png)',
            filter: 'blur(20px) brightness(0.7)',
            transform: 'scale(1.1)'
          }}
        ></div>
      </div>
      
      {/* Level 0: Background Image for Mobile */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        <div 
          className="h-full w-full max-w-md bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: step === 'COVER'
              ? 'url(https://kuku-quiz.s3.us-west-1.amazonaws.com/homepage.png)' 
              : step === 'RESULT'
              ? 'url(https://kuku-quiz.s3.us-west-1.amazonaws.com/result%20background.png)'
              : 'url(https://kuku-quiz.s3.us-west-1.amazonaws.com/quzi%20backgroud.png)'
          }}
        ></div>
      </div>

      {/* Level 1: Main Content Container */}
      <div className="w-full max-w-md h-full max-h-[850px] relative flex flex-col overflow-hidden z-[2]">
        
        {step !== 'COVER' && step !== 'LOADING' && (
          <div className="flex items-center justify-between mb-2 z-10 px-2 pt-2 shrink-0">
            <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {(step === 'QUIZ' || step === 'INPUTS') && (
              <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-fuchsia-500 transition-all duration-500"
                  style={{ width: step === 'INPUTS' ? `${(1 / (QUESTIONS.length + 1)) * 100}%` : `${((currentQuestionIndex + 2) / (QUESTIONS.length + 1)) * 100}%` }}
                ></div>
              </div>
            )}
            {step === 'RESULT' && (
              <>
                <div className="flex-1"></div>
                <button 
                  onClick={async () => {
                    const resultElement = document.querySelector('[data-result-capture]') as HTMLElement;
                    if (!resultElement) return;
                    
                    try {
                      const canvas = await html2canvas(resultElement, {
                        useCORS: true,
                        backgroundColor: '#1a0b2e',
                        scale: 2,
                        logging: false,
                      });
                      
                      canvas.toBlob(async (blob) => {
                        if (!blob) return;
                        const file = new File([blob], 'kuku-tv-duo-quiz.png', { type: 'image/png' });
                        
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                          try {
                            await navigator.share({
                              title: 'Which TV Duo Are You?',
                              files: [file]
                            });
                          } catch (err) {
                            console.log('Share cancelled');
                          }
                        } else {
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'kuku-tv-duo-quiz.png';
                          a.click();
                          URL.revokeObjectURL(url);
                        }
                      });
                    } catch (err) {
                      console.error('Capture failed:', err);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-fuchsia-500/20 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </>
            )}
            {step !== 'RESULT' && <div className="w-10"></div>}
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center animate-fadeIn overflow-hidden">
          {step === 'COVER' && <StepCover onStart={startQuiz} />}
          {step === 'INPUTS' && <StepInputs inputs={inputs} setInputs={setInputs} onContinue={handleInputsSubmit} />}
          {step === 'QUIZ' && <StepQuiz question={QUESTIONS[currentQuestionIndex]} index={currentQuestionIndex} onAnswer={handleAnswer} />}
          {step === 'LOADING' && <StepLoading />}
          {step === 'RESULT' && result && <StepResult result={result} inputs={inputs} />}
        </div>
      </div>
    </div>
  );
}

const StepCover = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center text-center h-full justify-between py-8">
    <div className="w-16 h-16 flex items-center justify-center mt-8">
        <img src="https://kuku-quiz.s3.us-west-1.amazonaws.com/logo.png" alt="Logo" className="w-full h-full object-contain" />
    </div>
    <div className="flex-1 flex flex-col items-center justify-center space-y-6 -mt-12">
      <div className="relative">
        <h1 className="text-[70px] font-title text-[#D3FFF8] uppercase tracking-normal leading-[80px] mb-2" style={{ lineHeight: '80px', letterSpacing: '0%' }}>
          Which TV <br/> Show Duo <br/> Are You?
        </h1>
        <span className="absolute -bottom-4 right-0 font-handwriting text-[#F539FF] opacity-90 text-[44.74px] rotate-[-8deg]" style={{ 
          lineHeight: '44.7px', 
          letterSpacing: '0px'
        }}>#Quiz</span>
      </div>
      <p className="text-white/90 text-[14px] font-button max-w-[280px] leading-relaxed mt-14">
        Find out what kind of relationship you have with your bestie/partner
      </p>
    </div>
    
    <div className="w-full px-6 pb-4">
        <button 
        onClick={onStart}
        className="w-[327px] h-[56px] bg-white rounded-[32px] text-[#F539FF] font-button text-[20px] shadow-[0_8px_0_#B13FB7] active:translate-y-1 active:shadow-[0_4px_0_#B13FB7] transition-all mx-auto block"
        style={{
          padding: '0 16px',
          gap: '10px'
        }}
        >
        Start Now
        </button>
    </div>
  </div>
);

const StepInputs = ({ inputs, setInputs, onContinue }: { inputs: UserInputs, setInputs: any, onContinue: () => void }) => {
  return (
  <div className="flex flex-col h-full justify-between py-4 px-6">
    <div className="space-y-6">
      <div className="relative mt-4">
          <div className="bg-black px-3 py-3.5 rounded-lg relative">
              <div className="absolute -top-[30px] -left-[15px] z-30 -rotate-6 w-[70px] h-[50px]">
                <img src="https://kuku-quiz.s3.us-west-1.amazonaws.com/chat.png" alt="Q1" className="w-full h-full object-contain" />
                <span className="absolute inset-0 flex items-center justify-center font-pixel text-white text-[16px] z-40" style={{ marginTop: '-4px' }}>Q1</span>
              </div>
              <h2 className="text-[28px] font-title leading-tight" style={{ color: '#D3FFF8', letterSpacing: '0.04em' }}>
                  <span className="text-fuchsia-500">Whose</span> relationship are <br/> you testing
              </h2>
              <img src={MASCOT_IMG} className="absolute -bottom-8 right-2 w-16 z-30" alt="Mascot" style={{ filter: 'none', opacity: 1 }} />
          </div>
      </div>

      <div className="space-y-6 mt-40">
        <input 
          type="text" 
          placeholder="Your nickname"
          maxLength={7}
          className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white text-[20px] font-title focus:outline-none focus:border-fuchsia-500 transition-colors placeholder:text-white/40"
          value={inputs.nickname}
          onChange={(e) => setInputs({ ...inputs, nickname: e.target.value })}
        />
        
        {inputs.nickname && (
          <select
            className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white text-[20px] font-title focus:outline-none focus:border-fuchsia-500 transition-colors appearance-none cursor-pointer"
            value={inputs.userGender || ''}
            onChange={(e) => setInputs({ ...inputs, userGender: e.target.value })}
            style={{ 
              color: inputs.userGender ? 'white' : 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <option value="" disabled hidden style={{ color: '#666', backgroundColor: '#fff', fontSize: '14px' }}>Your gender</option>
            <option value="Male" style={{ color: '#1a0b2e', backgroundColor: '#fff', fontSize: '14px' }}>Male</option>
            <option value="Female" style={{ color: '#1a0b2e', backgroundColor: '#fff', fontSize: '14px' }}>Female</option>
            <option value="Non-binary" style={{ color: '#1a0b2e', backgroundColor: '#fff', fontSize: '14px' }}>Non-binary</option>
          </select>
        )}

        <input 
          type="text" 
          placeholder="Your partner's name"
          maxLength={7}
          className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white text-[20px] font-title focus:outline-none focus:border-fuchsia-500 transition-colors placeholder:text-white/40"
          value={inputs.partnerName}
          onChange={(e) => setInputs({ ...inputs, partnerName: e.target.value })}
        />

        {inputs.partnerName && (
          <select
            className="w-full bg-transparent border-b-2 border-white/30 py-3 text-white text-[20px] font-title focus:outline-none focus:border-fuchsia-500 transition-colors appearance-none cursor-pointer"
            value={inputs.partnerGender || ''}
            onChange={(e) => setInputs({ ...inputs, partnerGender: e.target.value })}
            style={{ 
              color: inputs.partnerGender ? 'white' : 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <option value="" disabled hidden style={{ color: '#666', backgroundColor: '#fff', fontSize: '14px' }}>Partner's gender</option>
            <option value="Male" style={{ color: '#1a0b2e', backgroundColor: '#fff', fontSize: '14px' }}>Male</option>
            <option value="Female" style={{ color: '#1a0b2e', backgroundColor: '#fff', fontSize: '14px' }}>Female</option>
            <option value="Non-binary" style={{ color: '#1a0b2e', backgroundColor: '#fff', fontSize: '14px' }}>Non-binary</option>
          </select>
        )}
      </div>
    </div>

    <div className="w-full pb-4">
        <button 
        onClick={onContinue}
        disabled={!inputs.nickname || !inputs.partnerName}
        className="w-full h-[56px] bg-white rounded-[32px] text-[#F539FF] font-button text-[20px] shadow-[0_8px_0_#B13FB7] active:translate-y-1 active:shadow-[0_4px_0_#B13FB7] transition-all disabled:opacity-50"
        style={{
          padding: '0 16px',
          gap: '10px'
        }}
        >
        Continue
        </button>
    </div>
  </div>
  );
};

const StepQuiz = ({ question, index, onAnswer }: { question: any, index: number, onAnswer: (optionIndex: number) => void }) => {
  return (
  <div className="flex flex-col h-full justify-between py-4 px-6">
    <div className="space-y-6">
      <div className="relative mt-4">
          <div className="bg-black px-3 py-3.5 rounded-lg relative">
              <div className="absolute -top-[30px] -left-[15px] z-30 -rotate-6 w-[70px] h-[50px]">
                <img src="https://kuku-quiz.s3.us-west-1.amazonaws.com/chat.png" alt={`Q${index + 2}`} className="w-full h-full object-contain" />
                <span className="absolute inset-0 flex items-center justify-center font-pixel text-white text-[16px] z-40" style={{ marginTop: '-4px' }}>Q{index + 2}</span>
              </div>
              <h2 className="text-[28px] font-title leading-tight" style={{ color: '#D3FFF8', letterSpacing: '0.04em' }}>
                  {question.text.split(question.highlightWord).map((part: string, i: number) => (
                      <React.Fragment key={i}>
                          {part}
                          {i === 0 && <span className="text-fuchsia-500">{question.highlightWord}</span>}
                      </React.Fragment>
                  ))}
              </h2>
              <img src={MASCOT_IMG} className="absolute -bottom-8 right-2 w-16 z-30" alt="Mascot" style={{ filter: 'none', opacity: 1 }} />
          </div>
      </div>
    </div>

    <div className="space-y-2.5 pb-4">
      {question.options.map((opt: any, i: number) => (
        <button 
          key={i}
          onClick={() => onAnswer(i)}
          className="w-full py-3.5 px-6 rounded-full font-button transition-all text-center text-[14px] quiz-option-button"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 1)',
            color: 'white'
          }}
        >
          {opt.label}
        </button>
      ))}
      <style>{`
        .quiz-option-button:active {
          background-color: rgba(245, 57, 255, 0.5) !important;
          border: 2px solid #D3FFF8 !important;
          color: #D3FFF8 !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
        }
      `}</style>
    </div>
  </div>
  );
};

const StepLoading = () => (
    <div className="flex flex-col items-center justify-center h-full relative">
        <div className="relative w-80 h-80">
            <img src="https://kuku-quiz.s3.us-west-1.amazonaws.com/loading.png" alt="Loading" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-[28px] font-title text-[#D3FFF8] tracking-widest animate-pulse mt-8" style={{ letterSpacing: '0.04em' }}>
            Loading results...
        </h2>
    </div>
);

const StepResult = ({ result, inputs }: { result: QuizResult, inputs: UserInputs }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Function to parse and render description with highlighted keywords
  const renderDescription = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const word = part.slice(2, -2);
        return (
          <span key={index} style={{ color: '#FBAEFF', fontWeight: 500 }}>
            {word}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const captureImage = async (): Promise<Blob | null> => {
    if (!resultRef.current) return null;
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        useCORS: true,
        backgroundColor: '#1a0b2e',
        scale: 2,
        logging: false,
        width: resultRef.current.offsetWidth,
        height: resultRef.current.offsetHeight,
      });

      return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    } catch (err) {
      console.error('Capture failed:', err);
      return null;
    }
  };

  const handleShare = async () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    const blob = await captureImage();
    setIsCapturing(false);

    if (!blob) {
      alert('Failed to capture image');
      return;
    }

    const file = new File([blob], 'kuku-tv-duo-quiz.png', { type: 'image/png' });
    
    // Try native share first (works on mobile)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Which TV Duo Are You?',
          text: `${inputs.nickname} × ${inputs.partnerName} are ${result.duoName}! 💕`,
          files: [file]
        });
        return;
      } catch (err) {
        // User cancelled or share failed, show menu
      }
    }
    
    // Fallback: show share menu
    setShowShareMenu(true);
  };

  const downloadImage = async () => {
    setIsCapturing(true);
    const blob = await captureImage();
    setIsCapturing(false);

    if (!blob) {
      alert('Failed to capture image');
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kuku-tv-duo-quiz.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowShareMenu(false);
  };

  const shareToInstagram = async () => {
    await downloadImage();
    // Open Instagram app on mobile, or web on desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'instagram://';
      // Fallback to web if app not installed
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 1000);
    } else {
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  const shareToInstagramStories = async () => {
    await downloadImage();
    // Try to open Instagram Stories directly
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'instagram://story-camera';
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 1000);
    } else {
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  const copyImageToClipboard = async () => {
    setIsCapturing(true);
    const blob = await captureImage();
    setIsCapturing(false);

    if (!blob) {
      alert('Failed to capture image');
      return;
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('✅ Image copied! Now open Instagram and paste it.');
      setShowShareMenu(false);
    } catch (err) {
      // Clipboard API not supported, fallback to download
      await downloadImage();
    }
  };

  return (
    <div className="flex flex-col items-center h-full justify-between py-4 relative" data-result-capture>
      {/* Share Menu Overlay */}
      {showShareMenu && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowShareMenu(false)}>
          <div className="bg-[#1a0b2e] border-2 border-fuchsia-500 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-xl font-title mb-4 text-center">Share Your Result</h3>
            <div className="space-y-3">
              <button
                onClick={shareToInstagramStories}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full text-white font-button text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <span>📸</span>
                <span>Share to Instagram Stories</span>
              </button>
              <button
                onClick={shareToInstagram}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-button text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <span>📷</span>
                <span>Share to Instagram Feed</span>
              </button>
              <button
                onClick={copyImageToClipboard}
                className="w-full py-3 px-4 bg-fuchsia-500 rounded-full text-white font-button text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <span>📋</span>
                <span>Copy Image</span>
              </button>
              <button
                onClick={downloadImage}
                className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-full text-white font-button text-sm flex items-center justify-center space-x-2 hover:bg-white/20 transition-colors"
              >
                <span>💾</span>
                <span>Download Image</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareMenu(false)}
              className="mt-4 w-full py-2 text-white/60 font-button text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center w-full -mt-8">
        <div ref={resultRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="relative transform-gpu w-[88%] max-w-[340px] origin-center" style={{ marginLeft: '19px', marginTop: '29px' }}>
            {/* Polaroid background image - already rotated */}
            <img 
              src="/quiz-result-Polaroid.png" 
              alt="Polaroid frame" 
              className="w-full h-auto"
            />
            
            {/* Content overlay positioned on top of polaroid */}
            <div className="absolute inset-0 flex flex-col" style={{ padding: '14% 10% 14% 10%' }}>
              <div className="relative w-full aspect-square" style={{ transform: 'rotate(4deg)' }}>
                <div className="absolute inset-0 overflow-hidden">
                  <img src={result.image} alt={result.duoName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="absolute -top-10 -right-4 font-handwriting text-[#F539FF] text-[32px] rotate-[8deg] z-50">
                  Your TV Duo!
                </div>
              </div>
              
              {/* REFINED SMALL PIXEL RESULT BANNER - Speech bubble style */}
              <div className="pixel-result-banner" style={{ zIndex: 40, marginTop: '12px', transform: 'rotate(4deg)', maxWidth: '90%' }}>
                <span className="font-title text-white text-[20px] tracking-tight" style={{ 
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {result.duoName}
                </span>
              </div>
            </div>

            <img src="https://kuku-quiz.s3.us-west-1.amazonaws.com/cheering.png" className="absolute -bottom-8 -right-2 w-28 z-30" alt="Cheering" />
          </div>

          <div className="text-center mt-8">
              <h3 className="text-[52px] font-title tracking-tight uppercase line-clamp-1" style={{ color: '#D3FFF8', letterSpacing: '0.04em' }}>
                  {inputs.nickname} <span className="text-fuchsia-500 mx-1">×</span> {inputs.partnerName}
              </h3>
          </div>

          <div className="text-white/80 text-center text-[16px] font-button leading-snug px-4 max-w-[280px] line-clamp-3 mt-12 mb-12" style={{ letterSpacing: '-0.02em' }}>
              {renderDescription(result.description)}
          </div>
        </div>
      </div>

      <div className="w-full px-6 space-y-4 flex flex-col items-center pb-4">
          <p className="text-white/80 text-[14px] font-button text-center" style={{ letterSpacing: '-0.02em', lineHeight: '100%' }}>The full story unlocks in Kuku!</p>
          <button 
          onClick={() => window.open('https://futura.go.link/7dDFx', '_blank')}
          className="w-[327px] h-[56px] bg-white rounded-[32px] text-[#F539FF] font-button text-[20px] shadow-[0_8px_0_#B13FB7] active:translate-y-1 active:shadow-[0_4px_0_#B13FB7] flex items-center justify-center space-x-2 transition-all mx-auto cursor-pointer"
          style={{
            padding: '0 16px',
            gap: '10px'
          }}
          >
          <span>Continue In Kuku App</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          </button>
          <p className="text-white/40 text-[10px] font-button text-center mt-2">powered by Kuku, the app that actually gets you</p>
      </div>
    </div>
  );
};