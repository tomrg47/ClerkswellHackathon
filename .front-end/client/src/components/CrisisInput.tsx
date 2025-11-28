import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mic, MicOff, Phone as PhoneIcon, Users, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrisisInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

type Step = 'issue' | 'family' | 'contact';

export default function CrisisInput({ onSubmit, isLoading }: CrisisInputProps) {
  const [step, setStep] = useState<Step>('issue');
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  
  // Family state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Simple browser speech recognition setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setText(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         if (isListening) {
             setIsListening(false); 
         }
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'issue' && text.trim()) {
      setStep('family');
    } else if (step === 'family') {
      setStep('contact');
    } else if (step === 'contact' && phone.trim()) {
      // In a real app, we'd send all this data
      // For now, we'll append family info to the text so the mock engine picks it up
      const fullContext = `${text}\n\n[Family Context: ${adults} adults, ${children} children]`;
      onSubmit(fullContext);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleNext} className="relative">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-shadow focus-within:shadow-xl focus-within:border-primary/30 relative">
          
          <AnimatePresence mode="wait">
            {step === 'issue' ? (
              <motion.div
                key="issue"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type what's happening, or tap the microphone to speak..."
                    className="w-full min-h-[200px] p-8 text-lg md:text-xl font-sans text-primary placeholder:text-gray-300 focus:outline-none resize-none"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      "absolute top-4 right-4 p-3 rounded-full transition-all hover:scale-110 active:scale-95 shadow-sm",
                      isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                    title={isListening ? "Stop recording" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                </div>
              </motion.div>
            ) : step === 'family' ? (
              <motion.div
                key="family"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 min-h-[200px] flex flex-col justify-center"
              >
                <label className="block text-primary font-heading font-bold text-xl mb-6">
                  Who is in your household?
                </label>
                
                <div className="grid grid-cols-2 gap-8 max-w-lg">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                      <Users className="w-5 h-5 text-accent" /> Adults
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-heading font-bold text-primary w-8 text-center">{adults}</span>
                      <button 
                        type="button"
                        onClick={() => setAdults(Math.min(10, adults + 1))}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                      <Baby className="w-5 h-5 text-accent" /> Children
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-heading font-bold text-primary w-8 text-center">{children}</span>
                      <button 
                        type="button"
                        onClick={() => setChildren(Math.min(10, children + 1))}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 min-h-[200px] flex flex-col justify-center"
              >
                <label className="block text-primary font-heading font-bold text-xl mb-4">
                  Can we get your number?
                </label>
                <p className="text-gray-500 mb-6 font-sans">
                  We'll create a secure account so you can track your progress and we can reach you if we get disconnected.
                </p>
                <div className="relative max-w-md">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07700 900000"
                    className="w-full pl-12 pr-4 py-4 text-xl font-heading font-bold border-2 border-gray-200 rounded focus:border-accent focus:outline-none text-primary"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
             <div className="flex gap-2">
               <div className={cn("w-2 h-2 rounded-full transition-colors", step === 'issue' ? "bg-primary" : "bg-gray-300")}></div>
               <div className={cn("w-2 h-2 rounded-full transition-colors", step === 'family' ? "bg-primary" : "bg-gray-300")}></div>
               <div className={cn("w-2 h-2 rounded-full transition-colors", step === 'contact' ? "bg-primary" : "bg-gray-300")}></div>
             </div>

             <button
              type="submit"
              disabled={step === 'issue' ? !text.trim() : step === 'contact' ? (!phone.trim() || isLoading) : false}
              className={cn(
                "px-8 py-3 bg-accent text-primary font-heading font-bold text-lg rounded transition-all hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-none"
              )}
            >
              {isLoading ? (
                <span className="animate-pulse">Analyzing...</span>
              ) : (
                <>
                  {step === 'contact' ? 'Get Help' : 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {step === 'issue' && (
        <div className="mt-12">
          <p className="text-center text-sm text-gray-400 uppercase tracking-wider font-bold mb-6">Common Situations</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ExampleCard text="I need food shopping help" onClick={setText} />
            <ExampleCard text="I'd like to join a group" onClick={setText} />
            <ExampleCard text="My landlord served a notice" onClick={setText} />
          </div>
        </div>
      )}
    </div>
  );
}

function ExampleCard({ text, onClick }: { text: string, onClick: (t: string) => void }) {
  return (
    <button 
      onClick={() => onClick(text)}
      className="text-left p-5 bg-white rounded border border-gray-100 hover:border-accent hover:shadow-md transition-all group h-full"
    >
      <span className="text-primary font-sans font-medium group-hover:text-primary/80 transition-colors">
        "{text}"
      </span>
    </button>
  );
}
