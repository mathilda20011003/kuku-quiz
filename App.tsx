
import React, { useState, useRef, useEffect } from 'react';
import { Step, UserInputs, QuizResult } from './types';
import { QUESTIONS, ALL_RESULTS, LOGIC_MAPPING } from './constants';
import html2canvas from 'html2canvas';

const MASCOT_IMG = "https://kuku-quiz.s3.us-west-1.amazonaws.com/kuku.png";

// Preload background images
const BACKGROUND_IMAGES = {
  homepage: 'https://kuku-quiz.s3.us-west-1.amazonaws.com/homepage.png',
  quiz: 'https://kuku-quiz.s3.us-west-1.amazonaws.com/quzi%20backgroud.png',
  result: 'https://kuku-quiz.s3.us-west-1.amazonaws.com/result%20background.png'
};

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  // Preload all background images on mount
  useEffect(() => {
    console.log('Preloading background images...');
    Object.entries(BACKGROUND_IMAGES).forEach(([key, url]) => {
      const img = new Image();
      img.onload = () => console.log(`Background ${key} preloaded`);
      img.onerror = () => console.error(`Failed to preload background ${key}`);
      img.src = url;
    });
  }, []);
  const startQuiz = () => setStep('INPUTS');
  
  const handleInputsSubmit = () => {
    if (inputs.nickname && inputs.partnerName && inputs.userGender && inputs.partnerGender) {
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
    
    // Calculate result first
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
    
    const poolLogic = LOGIC_MAPPING[targetPool];
    const scores: Record<string, number> = {};
    
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
    
    let maxScore = 0;
    let winningId = '';
    
    Object.entries(scores).forEach(([id, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningId = id;
      }
    });
    
    if (!winningId) {
      const poolPrefix = targetPool === 'POOL_MM' ? 'MM' : targetPool === 'POOL_FF' ? 'FF' : 'MF';
      winningId = `${poolPrefix}_01`;
    }
    
    const finalResult = ALL_RESULTS[winningId];
    
    // Preload ALL images during loading screen and wait for them
    const imagesToPreload = [
      finalResult.image,
      '/quiz-result-Polaroid.png',
      'https://kuku-quiz.s3.us-west-1.amazonaws.com/result+background.png',
      '/cheering.png',
      '/qrcode.png'
    ];
    
    const preloadPromises = imagesToPreload.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          console.log(`Preloaded: ${src}`);
          resolve(src);
        };
        img.onerror = (err) => {
          console.error(`Failed to preload: ${src}`, err);
          resolve(src); // Resolve anyway to not block
        };
        img.src = src;
      });
    });
    
    // Wait for all images to preload, then show result after 5 seconds
    Promise.all(preloadPromises).then(() => {
      console.log('All images preloaded successfully');
    });
    
    setTimeout(() => {
      setResult(finalResult);
      setStep('RESULT');
    }, 5000);
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

  // Capture and share functions for result page
  const waitForImages = async (element: HTMLElement): Promise<void> => {
    const images = element.querySelectorAll('img');
    console.log(`Found ${images.length} images to check`);
    
    const imagePromises = Array.from(images)
      .filter((img, index) => {
        const isLoaded = img.complete && img.naturalHeight !== 0;
        if (isLoaded) {
          console.log(`Image ${index} already loaded: ${img.src}`);
        }
        return !isLoaded; // Only wait for images that aren't loaded yet
      })
      .map((img, index) => {
        console.log(`Waiting for image ${index}: ${img.src}`);
        
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.warn(`Image ${index} timeout: ${img.src}`);
            reject(new Error(`Timeout loading ${img.src}`));
          }, 10000);
          
          img.onload = () => {
            clearTimeout(timeout);
            console.log(`Image ${index} loaded successfully`);
            resolve();
          };
          
          img.onerror = (err) => {
            clearTimeout(timeout);
            console.error(`Image ${index} failed to load: ${img.src}`, err);
            reject(err);
          };
          
          // Force reload if not complete
          if (!img.complete) {
            const src = img.src;
            img.src = '';
            img.src = src;
          }
        });
      });
    
    if (imagePromises.length === 0) {
      console.log('All images already loaded, no need to wait');
      return;
    }
    
    try {
      await Promise.all(imagePromises);
      console.log('All pending images loaded successfully');
      // Wait a brief moment to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.error('Some images failed to load:', err);
      // Continue anyway after waiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const captureImage = async (): Promise<Blob | null> => {
    if (!captureRef.current) return null;
    
    console.time('Total capture time');
    
    // Wait for all images to load
    console.time('Image loading');
    await waitForImages(captureRef.current);
    console.timeEnd('Image loading');
    
    // Debug: Check computed styles
    const computedStyle = window.getComputedStyle(captureRef.current);
    console.log('Capture element background:', computedStyle.backgroundImage);
    console.log('Capture element backgroundColor:', computedStyle.backgroundColor);
    console.log('Capture element dimensions:', {
      width: captureRef.current.offsetWidth,
      height: captureRef.current.offsetHeight
    });
    
    try {
      console.time('html2canvas rendering');
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scale: 2,
        logging: false,
        width: 400,
      });
      console.timeEnd('html2canvas rendering');
      
      console.log('Canvas dimensions:', {
        width: canvas.width,
        height: canvas.height
      });

      console.time('Blob conversion');
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      console.timeEnd('Blob conversion');
      
      console.timeEnd('Total capture time');
      return blob;
    } catch (err) {
      console.error('Capture failed:', err);
      console.timeEnd('Total capture time');
      alert('Screenshot failed. Error: ' + (err as Error).message);
      return null;
    }
  };

  const saveImage = async () => {
    setIsDownloading(true);
    try {
      const blob = await captureImage();
      if (!blob) {
        alert('Failed to capture image');
        return;
      }

      // Check if we're on iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS || isSafari) {
        // For iOS/Safari: Try native share first, then download
        const file = new File([blob], 'kuku-tv-duo-quiz.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Kuku TV Duo Quiz Result',
              files: [file]
            });
            return;
          } catch (err) {
            console.log('Share cancelled or failed, trying download...');
          }
        }
        
        // Fallback: Try direct download
        try {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'kuku-tv-duo-quiz.png';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
        } catch (err) {
          console.error('Download failed:', err);
          alert('Unable to download. Please try the share button instead.');
        }
      } else {
        // For other browsers: Use download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kuku-tv-duo-quiz.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const blob = await captureImage();
      if (!blob) {
        alert('Failed to capture image');
        return;
      }

      const file = new File([blob], 'kuku-tv-duo-quiz.png', { type: 'image/png' });
      
      // Check if device supports native share with files
      const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });
      
      if (canShareFiles) {
        // Mobile: Try native share first
        try {
          await navigator.share({
            title: 'Which TV Duo Are You?',
            text: result ? `${inputs.nickname} × ${inputs.partnerName} are ${result.duoName}! 💕` : '',
            files: [file]
          });
          return; // Success, exit
        } catch (err) {
          // User cancelled or share failed
          if (err instanceof Error && err.name === 'AbortError') {
            // User cancelled, do nothing
            console.log('Share cancelled by user');
            return;
          }
          // Other error, fall through to custom menu
          console.log('Native share failed, showing custom menu');
        }
      }
      
      // Desktop or native share not available: show custom share menu
      setShowShareMenu(true);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#1a0b2e', height: '100dvh', minHeight: '100dvh' }}>
      {/* Level -1: Blurred Background for Desktop */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div 
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: step === 'COVER'
              ? `url(${BACKGROUND_IMAGES.homepage})` 
              : step === 'RESULT'
              ? `url(${BACKGROUND_IMAGES.result})`
              : `url(${BACKGROUND_IMAGES.quiz})`,
            filter: 'blur(20px) brightness(0.7)',
            transform: 'scale(1.1)'
          }}
        ></div>
      </div>
      
      {/* Level 0: Background Image for Mobile */}
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        <div 
          className="w-full max-w-md bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: step === 'COVER'
              ? `url(${BACKGROUND_IMAGES.homepage})` 
              : step === 'RESULT'
              ? `url(${BACKGROUND_IMAGES.result})`
              : `url(${BACKGROUND_IMAGES.quiz})`,
            minHeight: '100dvh',
            height: '100%'
          }}
        ></div>
      </div>

      {/* Level 1: Main Content Container */}
      <div className="w-full max-w-md h-full relative flex flex-col overflow-y-auto overflow-x-hidden z-[2]" style={{ minHeight: '100dvh' }}>
        
        {step !== 'COVER' && step !== 'LOADING' && (
          <div className="flex items-center justify-between mb-2 z-10 px-2 pt-4 sticky top-0 pb-2">
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
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={saveImage}
                    disabled={isDownloading}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-fuchsia-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save Image"
                  >
                    {isDownloading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </button>
                  <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-fuchsia-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Share"
                  >
                    {isSharing ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
            {step !== 'RESULT' && <div className="w-10"></div>}
          </div>
        )}

        <div className={`flex-1 flex flex-col animate-fadeIn ${step === 'RESULT' ? 'justify-start' : 'justify-center'}`}>
          {step === 'COVER' && <StepCover onStart={startQuiz} />}
          {step === 'INPUTS' && <StepInputs inputs={inputs} setInputs={setInputs} onContinue={handleInputsSubmit} />}
          {step === 'QUIZ' && <StepQuiz question={QUESTIONS[currentQuestionIndex]} index={currentQuestionIndex} onAnswer={handleAnswer} />}
          {step === 'LOADING' && <StepLoading />}
          {step === 'RESULT' && result && <StepResult result={result} inputs={inputs} captureRef={captureRef} showShareMenu={showShareMenu} setShowShareMenu={setShowShareMenu} />}
        </div>
      </div>
    </div>
  );
}

const StepCover = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center text-center h-full justify-between py-4">
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
    
    <div className="w-full px-6 pb-8">
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

    <div className="w-full pb-8">
        <button 
        onClick={onContinue}
        disabled={!inputs.nickname || !inputs.partnerName || !inputs.userGender || !inputs.partnerGender}
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

    <div className="space-y-2.5 pb-8">
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

const StepResult = ({ result, inputs, captureRef, showShareMenu, setShowShareMenu }: { 
  result: QuizResult, 
  inputs: UserInputs,
  captureRef: React.RefObject<HTMLDivElement>,
  showShareMenu: boolean,
  setShowShareMenu: (show: boolean) => void
}) => {
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

  const shareToWhatsApp = () => {
    const text = `I just took the "Which TV Duo Are You?" quiz and got ${result.duoName}! 💕 Come find out yours!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const text = `I just took the "Which TV Duo Are You?" quiz and got ${result.duoName}! 💕 Come find out yours!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=TVDuoQuiz,Kuku`, '_blank');
    setShowShareMenu(false);
  };

  const shareToTelegram = () => {
    const text = `I just took the "Which TV Duo Are You?" quiz and got ${result.duoName}! 💕 Come find out yours!`;
    const url = window.location.href;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToReddit = () => {
    const title = `I just took the "Which TV Duo Are You?" quiz and got ${result.duoName}! 💕`;
    const url = window.location.href;
    window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
    setShowShareMenu(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('✅ Link copied to clipboard!');
      setShowShareMenu(false);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="result-page-container flex flex-col items-center h-full justify-between py-2 relative overflow-y-auto overflow-x-hidden">
      {/* Share Menu Overlay */}
      {showShareMenu && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center p-4" 
          onClick={() => setShowShareMenu(false)}
        >
          <div 
            className="relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a0b2e 0%, #2a1442 50%, #1a0b2e 100%)',
              border: '3px solid #4cc9f0',
              borderRadius: '24px',
              padding: '32px 24px',
              boxShadow: '0 20px 60px rgba(245, 57, 255, 0.4), 0 0 40px rgba(76, 201, 240, 0.3), inset 0 0 60px rgba(245, 57, 255, 0.1)'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowShareMenu(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <h3 className="text-[#D3FFF8] text-2xl font-title mb-6 text-center uppercase tracking-wide">
              Share Your Result
            </h3>
            
            <div className="space-y-3">
              {isMobile ? (
                <>
                  <button
                    onClick={shareToWhatsApp}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">💬</span>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={shareToTwitter}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">𝕏</span>
                    <span>Twitter / X</span>
                  </button>
                  <button
                    onClick={shareToTelegram}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">✈️</span>
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={shareToFacebook}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">📘</span>
                    <span>Facebook</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={copyLink}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">🔗</span>
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={shareToTwitter}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">𝕏</span>
                    <span>Twitter / X</span>
                  </button>
                  <button
                    onClick={shareToFacebook}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">📘</span>
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={shareToReddit}
                    className="w-full py-3.5 px-5 rounded-full text-white font-button text-base flex items-center justify-center space-x-3 transition-all transform hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F539FF 0%, #B13FB7 100%)',
                      boxShadow: '0 4px 15px rgba(245, 57, 255, 0.5)',
                      border: '2px solid #4cc9f0'
                    }}
                  >
                    <span className="text-xl">🤖</span>
                    <span>Reddit</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Capture Area - Only for screenshot, not displayed */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, opacity: 0, pointerEvents: 'none' }}>
        <div ref={captureRef} style={{ 
          width: '400px',
          height: 'auto',
          minHeight: '750px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Image - MUST be first child */}
          <img 
            src="https://kuku-quiz.s3.us-west-1.amazonaws.com/result+background.png"
            alt=""
            crossOrigin="anonymous"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              minHeight: '750px'
            }}
          />
          
          {/* Content layer - positioned above background */}
          <div style={{
            position: 'relative',
            width: '100%',
            padding: '40px 20px 40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div className="relative transform-gpu w-[88%] max-w-[340px] origin-center" style={{ marginLeft: '19px', marginTop: '29px' }}>
              {/* Polaroid background image */}
              <img 
                src="/quiz-result-Polaroid.png" 
                alt="Polaroid frame" 
                className="w-full h-auto"
                crossOrigin="anonymous"
              />
              
              {/* Content overlay positioned on top of polaroid */}
              <div className="absolute inset-0 flex flex-col" style={{ padding: '14% 10% 14% 10%' }}>
                <div className="relative w-full aspect-square" style={{ transform: 'rotate(4deg)' }}>
                  <div className="absolute inset-0 overflow-hidden">
                    <img src={result.image} alt={result.duoName} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  </div>
                  <div className="absolute -top-10 -right-4 font-handwriting text-[#F539FF] text-[32px] rotate-[8deg] z-50">
                    Your TV Duo!
                  </div>
                </div>
                
                {/* Result banner */}
                <div className="pixel-result-banner" style={{ zIndex: 40, marginTop: '4px', transform: 'rotate(4deg)', maxWidth: '90%' }}>
                  <span className="font-title text-white text-[16px] tracking-tight" style={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    lineHeight: '1.3',
                    textAlign: 'center'
                  }}>
                    {result.duoName}
                  </span>
                </div>
              </div>

              <img src="/cheering.png" className="absolute -bottom-8 -right-2 w-28 z-30" alt="Cheering" crossOrigin="anonymous" />
            </div>

            <div className="text-center mt-8" style={{ width: '100%', padding: '0 20px' }}>
              <h3 className="font-title tracking-tight uppercase" style={{ 
                color: '#D3FFF8', 
                letterSpacing: '0.04em', 
                lineHeight: '1.2',
                fontSize: '40px',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                textAlign: 'center',
                fontFamily: '"Bernard MT Condensed", "Bebas Neue", sans-serif'
              }}>
                {inputs.nickname} <span className="text-fuchsia-500 mx-1">×</span> {inputs.partnerName}
              </h3>
            </div>

            <div className="text-white/80 font-button leading-snug px-6 max-w-[320px] mt-6" style={{ 
              letterSpacing: '-0.02em',
              fontSize: '14px',
              lineHeight: '19px',
              textAlign: 'left'
            }}>
              {renderDescription(result.description)}
            </div>

            {/* QR Code - Small size */}
            <div className="flex flex-col items-center mt-8 mb-4">
              <img 
                src="/qrcode.png" 
                alt="Kuku App QR Code" 
                style={{ width: '80px', height: '80px', marginBottom: '8px' }}
                crossOrigin="anonymous"
              />
              <p className="text-white/80 text-[12px] font-button text-center">
                The full story unlocks in Kuku!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visible Result Display - Original layout */}
      <div className="flex flex-col items-center w-full" style={{ marginTop: '-16px' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="relative transform-gpu w-[88%] max-w-[340px] origin-center" style={{ marginLeft: '19px' }}>
            {/* Polaroid background image */}
            <img 
              src="/quiz-result-Polaroid.png" 
              alt="Polaroid frame" 
              className="w-full h-auto"
            />
            
            {/* Content overlay positioned on top of polaroid */}
            <div className="absolute inset-0 flex flex-col" style={{ padding: '14% 10% 14% 10%' }}>
              <div className="relative w-full aspect-square" style={{ transform: 'rotate(4deg)' }}>
                <div className="absolute inset-0 overflow-hidden">
                  <img src={result.image} alt={result.duoName} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="absolute -top-10 -right-4 font-handwriting text-[#F539FF] text-[32px] rotate-[8deg] z-50">
                  Your TV Duo!
                </div>
              </div>
              
              {/* Result banner */}
              <div className="pixel-result-banner" style={{ zIndex: 40, marginTop: '12px', transform: 'rotate(4deg)', maxWidth: '90%' }}>
                <span className="font-title text-white text-[16px] tracking-tight" style={{ 
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  lineHeight: '1.3',
                  textAlign: 'center'
                }}>
                  {result.duoName}
                </span>
              </div>
            </div>

            <img src="https://kuku-quiz.s3.us-west-1.amazonaws.com/cheering.png" className="absolute -bottom-8 -right-2 w-28 z-30" alt="Cheering" />
          </div>

          <div className="text-center mt-4">
            <h3 className="text-[52px] font-title tracking-tight uppercase line-clamp-1" style={{ 
              color: '#D3FFF8', 
              letterSpacing: '0.04em',
              fontFamily: '"Bernard MT Condensed", "Bebas Neue", sans-serif'
            }}>
              {inputs.nickname} <span className="text-fuchsia-500 mx-1">×</span> {inputs.partnerName}
            </h3>
          </div>

          <div className="text-white/80 text-[16px] font-button leading-snug px-4 max-w-[280px] mt-6 mb-4" style={{ 
            letterSpacing: '-0.02em',
            lineHeight: '19px',
            textAlign: 'left'
          }}>
            {renderDescription(result.description)}
          </div>
        </div>
      </div>

      {/* Buttons Area - Original layout */}
      <div className="w-full px-6 flex flex-col items-center pb-20">
        <p className="text-white/80 text-[14px] font-button text-center italic mb-3" style={{ letterSpacing: '-0.02em', lineHeight: '100%' }}>
          The full story unlocks in Kuku!
        </p>
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
        <p className="text-white/40 text-[10px] font-button text-center mt-10">
          powered by Kuku, the app that actually gets you
        </p>
      </div>
    </div>
  );
};