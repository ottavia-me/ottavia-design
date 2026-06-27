import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const svgPaths = {
  p1c1a8200: "M19.2 1.25236C19.2 0.5607 18.7224 0 18.1333 0H17.0667C16.4776 0 16 0.5607 16 1.25236V12.1061C16 12.7978 16.4776 13.3585 17.0667 13.3585H18.1333C18.7224 13.3585 19.2 12.7978 19.2 12.1061V1.25236ZM11.7659 2.6717H12.8326C13.4217 2.6717 13.8992 3.24585 13.8992 3.95411V12.0761C13.8992 12.7843 13.4217 13.3585 12.8326 13.3585H11.7659C11.1768 13.3585 10.6992 12.7843 10.6992 12.0761V3.95411C10.6992 3.24585 11.1768 2.6717 11.7659 2.6717ZM7.43411 5.56603H6.36745C5.77834 5.56603 5.30078 6.14749 5.30078 6.86477V12.0597C5.30078 12.777 5.77834 13.3585 6.36745 13.3585H7.43411C8.02322 13.3585 8.50078 12.777 8.50078 12.0597V6.86477C8.50078 6.14749 8.02322 5.56603 7.43411 5.56603ZM2.13333 8.23774H1.06667C0.477563 8.23774 0 8.8109 0 9.51793V12.0783C0 12.7853 0.477563 13.3585 1.06667 13.3585H2.13333C2.72244 13.3585 3.2 12.7853 3.2 12.0783V9.51793C3.2 8.8109 2.72244 8.23774 2.13333 8.23774Z",
  p2c0bf800: "M10.2357 3.95032C10.4472 4.16185 10.4472 4.50482 10.2357 4.71635L5.82613 9.12883C5.72334 9.23162 5.58355 9.28878 5.4382 9.28746C5.29284 9.28614 5.15412 9.22646 5.05321 9.12183L2.9696 6.98118C2.76194 6.76585 2.76815 6.42294 2.98349 6.21528C3.19882 6.00761 3.54173 6.01383 3.7494 6.22917L5.45012 7.97278L9.46967 3.95032C9.6812 3.73878 10.0242 3.73878 10.2357 3.95032Z",
  p323dee00: "M8.5713 2.69464C11.0584 2.69476 13.4504 3.70222 15.2529 5.5088C15.3887 5.64827 15.6056 5.64651 15.7393 5.50485L17.0368 4.1244C17.1045 4.05255 17.1422 3.95522 17.1417 3.85396C17.1411 3.7527 17.1023 3.65585 17.0338 3.58484C12.3028 -1.19495 4.83907 -1.19495 0.108056 3.58484C0.039524 3.65579 0.000639766 3.75262 7.82398e-06 3.85388C-0.000624118 3.95514 0.0370483 4.0525 0.104689 4.1244L1.40255 5.50485C1.53615 5.64673 1.75327 5.64849 1.88893 5.5088C3.69167 3.7021 6.08395 2.69463 8.5713 2.69464ZM8.56795 7.30568C9.92527 7.30559 11.2341 7.86471 12.2403 8.87441C12.3763 9.01771 12.5907 9.0146 12.7234 8.86741L14.0106 7.42594C14.0784 7.35033 14.1161 7.24776 14.1151 7.14118C14.1141 7.0346 14.0746 6.93289 14.0054 6.85883C10.9416 3.70031 6.19688 3.70031 3.13305 6.85883C3.06384 6.93289 3.02435 7.03465 3.02345 7.14126C3.02254 7.24788 3.06028 7.35044 3.12822 7.42594L4.41513 8.86741C4.54778 9.0146 4.76215 9.01771 4.89823 8.87441C5.90368 7.86538 7.21152 7.30631 8.56795 7.30568ZM11.0924 10.3579C11.0943 10.473 11.0572 10.584 10.9899 10.6646L8.81327 13.3466C8.74946 13.4255 8.66247 13.4698 8.5717 13.4698C8.48093 13.4698 8.39394 13.4255 8.33013 13.3466L6.1531 10.6646C6.08585 10.5839 6.04886 10.4729 6.05085 10.3578C6.05284 10.2427 6.09365 10.1337 6.16364 10.0565C7.55374 8.62099 9.58966 8.62099 10.9798 10.0565C11.0497 10.1338 11.0904 10.2428 11.0924 10.3579Z",
  pb2786c0: "M0 0V4.45283C0.804731 4.0757 1.32804 3.19839 1.32804 2.22642C1.32804 1.25444 0.804731 0.377129 0 0",
};

function Battery() {
  return (
    <div className="-translate-x-1/2 absolute bottom-0 contents left-[calc(50%+25.81px)] top-0" data-name="Battery">
      <div className="-translate-x-1/2 absolute border border-black border-solid bottom-0 left-[calc(50%+24.65px)] opacity-35 rounded-[4.3px] top-0 w-[25px]" data-name="Border" />
      <div className="-translate-x-1/2 absolute bottom-[31.87%] left-[calc(50%+38.81px)] top-[36.78%] w-[1.328px]" data-name="Cap">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.32804 4.45283">
          <path d={svgPaths.pb2786c0} fill="black" opacity="0.4" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bg-black bottom-[15.38%] left-[calc(50%+24.65px)] rounded-[2.5px] top-[15.38%] w-[21px]" data-name="Capacity" />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[14.204px] left-[21.35%] right-[22.9%] top-[22.4px]">
      <Battery />
      <div className="-translate-x-1/2 absolute bottom-[0.26%] left-[calc(50%-3.58px)] top-[4.91%] w-[17.142px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 13.4698">
          <path clipRule="evenodd" d={svgPaths.p323dee00} fill="black" fillRule="evenodd" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[1.83%] left-[calc(50%-29.25px)] top-[4.12%] w-[19.2px]" data-name="Cellular Connection">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 13.3585">
          <path clipRule="evenodd" d={svgPaths.p1c1a8200} fill="black" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

function Levels() {
  return (
    <div className="-translate-y-1/2 absolute h-[59px] left-[64.38%] right-[-0.13%] top-1/2" data-name="Levels">
      <Frame />
    </div>
  );
}

function Time() {
  return (
    <div className="-translate-y-1/2 absolute h-[59px] left-0 right-[64.25%] top-1/2" data-name="Time">
      <div className="absolute flex flex-col font-semibold inset-[0_36.65%_0_37.01%] justify-center leading-[0] text-[17px] text-black text-center">
        <p className="leading-[22px] whitespace-pre-wrap">9:41</p>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="-translate-x-1/2 absolute bg-transparent h-[59px] left-1/2 overflow-clip top-0 w-[430px]" data-name="Status Bar">
      <Levels />
      <Time />
    </div>
  );
}

function AnimatedItem({ text, top, left, isVisible, gradient = false, circleColor = '#6C574C', checkColor = '#E9D8C6' }) {
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!isVisible) {
      setTypedText('');
      setIsTypingComplete(false);
      setShowCheck(false);
      setStartTime(null);
      return;
    }

    setStartTime(Date.now());

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [isVisible, text]);

  useEffect(() => {
    if (isTypingComplete && startTime) {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsed);

      const timer = setTimeout(() => {
        setShowCheck(true);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isTypingComplete, startTime]);

  const shouldShowShimmer = isVisible && !showCheck;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Circle indicator */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              mass: 0.8,
            }}
            className="absolute left-[27px] size-[13px]"
            style={{ top: `calc(${top} + 6.5px)` }}
          >
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
              <circle cx="6.5" cy="6.5" fill={circleColor} r="6.5" />
            </svg>
          </motion.div>

          {/* Checkmark with spring animation */}
          <AnimatePresence>
            {showCheck && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 18,
                  mass: 0.5,
                }}
                className="absolute left-[27px] size-[13px]"
                style={{ top: `calc(${top} + 6.5px)` }}
              >
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                  <path
                    clipRule="evenodd"
                    d={svgPaths.p2c0bf800}
                    fill={checkColor}
                    fillRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Typed text */}
          <div
            className="absolute font-semibold leading-[26px] text-[20px] w-[331px] whitespace-pre-wrap"
            style={{ top, left }}
          >
            <div className="relative">
              {/* Base text (shows after shimmer stops) */}
              <p
                className={gradient ? 'bg-clip-text bg-gradient-to-r from-[#6c574c] to-[#d2a994]' : 'text-[#6c574c]'}
                style={{
                  ...(gradient ? { WebkitTextFillColor: 'transparent' } : {}),
                  opacity: showCheck ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                {text}
              </p>

              {/* Typing + shimmer text (shows during typing and shimmer) */}
              {shouldShowShimmer && (
                <div className="absolute inset-0 overflow-hidden">
                  <motion.p
                    className="bg-clip-text relative"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, rgba(108, 87, 76, 0.5) 0%, rgba(108, 87, 76, 0.65) 30%, rgba(208, 186, 175, 0.75) 45%, rgba(225, 210, 202, 0.85) 50%, rgba(208, 186, 175, 0.75) 55%, rgba(108, 87, 76, 0.65) 70%, rgba(108, 87, 76, 0.5) 100%)',
                      backgroundSize: '200% 100%',
                      WebkitTextFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '200% 0%'],
                    }}
                    transition={{
                      duration: 2,
                      ease: 'linear',
                      repeat: Infinity,
                    }}
                  >
                    {typedText}
                  </motion.p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(-1);

  const items = [
    {
      text: "Let's begin",
      top: '169px',
      left: 'calc(50% - 188px)',
      circleColor: 'transparent',
      checkColor: 'transparent',
    },
    {
      text: 'Diving into your activity history',
      top: '227px',
      left: 'calc(50% - 157px)',
    },
    {
      text: 'Uncovering patterns in your workouts',
      top: '279px',
      left: 'calc(50% - 157px)',
    },
    {
      text: 'Discovering how you recover',
      top: '332px',
      left: 'calc(50% - 157px)',
    },
    {
      text: 'Finding connections between sleep and energy',
      top: '389px',
      left: 'calc(50% - 157px)',
    },
    {
      text: 'Spotting what makes you perform best',
      top: '473px',
      left: 'calc(50% - 157px)',
    },
    {
      text: 'Building your unique athletic fingerprint',
      top: '557px',
      left: 'calc(50% - 157px)',
    },
    {
      text: 'Ready to see what we found?',
      top: '635px',
      left: 'calc(50% - 157px)',
      gradient: true,
      circleColor: '#D0BAAF',
      checkColor: '#F8EEE3',
    },
  ];

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setCurrentStep(0);
    }, 800);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < items.length - 1) {
      const currentText = items[currentStep].text;
      const typingTime = currentText.length * 30;
      const totalTime = Math.max(2000, typingTime) + 500;

      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, totalTime);

      return () => clearTimeout(timer);
    }
  }, [currentStep, items.length]);

  return (
    <div className="bg-[rgba(0,0,0,0.2)] relative shadow-[0px_5px_73px_-4px_rgba(106,134,147,0.13)] size-full overflow-hidden">
      {/* Breathing animated background with slow moving gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#e9d9c7] to-[#f5f1ea]"
          animate={{
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[rgba(233,217,199,0.4)] via-transparent to-[rgba(245,241,234,0.3)]"
          animate={{
            x: [0, 40, 0],
            y: [0, 25, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(208,186,175,0.2)] to-transparent"
          animate={{
            x: [0, -25, 0],
            y: [0, 35, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-bl from-[rgba(245,241,234,0.15)] via-transparent to-[rgba(222,193,175,0.15)]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Home Indicator */}
      <div className="-translate-x-1/2 absolute bottom-[9px] flex h-[5px] items-center justify-center left-1/2 w-[144px] z-10">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="bg-black h-[5px] rounded-[100px] w-[144px]" data-name="Home Indicator" />
        </div>
      </div>

      <StatusBar />

      {/* Vertical line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: currentStep >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        className="absolute flex h-[362px] items-center justify-center left-[33px] origin-top top-[234px] w-0"
      >
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[362px]">
            <div className="absolute inset-[-1.5px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 362 1.5">
                <line stroke="url(#paint0_linear_1_143)" strokeWidth="1.5" x2="362" y1="0.75" y2="0.75" />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_143" x1="0" x2="362" y1="2" y2="2">
                    <stop offset="0.658654" stopColor="#E1D2CA" />
                    <stop offset="1" stopColor="#DEC1AF" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Animated items */}
      {items.map((item, index) => (
        <AnimatedItem
          key={index}
          text={item.text}
          top={item.top}
          left={item.left}
          isVisible={currentStep >= index}
          gradient={item.gradient}
          circleColor={item.circleColor}
          checkColor={item.checkColor}
        />
      ))}
    </div>
  );
}
