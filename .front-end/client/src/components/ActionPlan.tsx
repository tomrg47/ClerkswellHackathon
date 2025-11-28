import { motion } from "framer-motion";
import { CrisisAssessment, ActionStep } from "@/lib/mock-engine";
import { CheckCircle2, Phone, MapPin, Clock, AlertTriangle, FileText, ChevronRight, Calendar, Heart, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionPlanProps {
  assessment: CrisisAssessment;
  onReset: () => void;
}

export default function ActionPlan({ assessment, onReset }: ActionPlanProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <span className="text-primary font-heading font-bold">{assessment.category} Support</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className={cn("font-bold text-sm", assessment.urgency === 'Hours' ? "text-red-500" : "text-orange-500")}>
            Priority: {assessment.urgency}
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Your Personal Plan</h2>
        <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
          We've set up your secure account. Here are the steps we recommend for you.
        </p>
      </motion.div>

      {/* QR Code Card for Quick Scan */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 max-w-xl mx-auto relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
         
         <div className="flex-1">
            <h3 className="font-heading font-bold text-xl text-primary mb-1">Your Digital Pass</h3>
            <p className="text-sm text-gray-500 mb-3">Show this to staff at Restore Hope events or the supermarket.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wide">
               <QrCode className="w-4 h-4" /> Ready to Scan
            </div>
         </div>

         <div className="flex flex-col items-center gap-2 shrink-0 relative z-10">
            <div className="bg-white p-2 rounded border border-gray-100 shadow-sm">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NEW-FAMILY-ACCESS-TOKEN" 
                alt="Access QR" 
                className="w-24 h-24"
              />
            </div>
            <p className="text-primary font-heading font-bold text-lg uppercase tracking-wider">happy-river</p>
         </div>
      </motion.div>

      {/* Questions Section (if any) */}
      {assessment.questions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 bg-white border border-blue-100 rounded-lg p-8 shadow-sm"
        >
          <h3 className="font-heading text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            Missing Information
          </h3>
          <div className="space-y-2">
             <p className="text-gray-500 mb-4">To give you the best advice, a support worker will need to know:</p>
             <ul className="grid md:grid-cols-2 gap-4">
              {assessment.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-primary font-medium">
                  <span className="text-accent mt-1">●</span> {q}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Steps */}
      <div className="space-y-6">
        {assessment.plan.map((step, index) => (
          <ActionStepCard key={step.id} step={step} index={index} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-primary font-heading font-bold uppercase text-sm tracking-wider transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

function ActionStepCard({ step, index }: { step: ActionStep, index: number }) {
  const isEvent = step.type === 'event';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + (index * 0.1) }}
      className={cn(
        "group relative bg-white rounded-lg p-6 md:p-8 border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        isEvent ? "border-accent/50 bg-gradient-to-br from-white to-yellow-50" : "border-gray-100"
      )}
    >
      {isEvent && (
        <div className="absolute top-0 right-0 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-bl">
          Restore Hope Event
        </div>
      )}

      <div className="flex gap-6">
        <div className="hidden md:flex flex-col items-center gap-2">
           <div className={cn(
             "w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-xl shrink-0 transition-colors",
             isEvent ? "bg-accent text-primary" : "bg-primary text-white group-hover:bg-primary/90"
           )}>
             {isEvent ? <Heart className="w-6 h-6" /> : index + 1}
           </div>
           {!isEvent && <div className="w-0.5 h-full bg-gray-100 last:hidden"></div>}
        </div>
        
        <div className="flex-1">
          <div className="flex md:hidden w-8 h-8 rounded-full bg-primary text-white items-center justify-center font-heading font-bold text-sm mb-4">
             {isEvent ? <Heart className="w-4 h-4" /> : index + 1}
          </div>

          <h3 className="text-2xl font-heading font-bold text-primary mb-2">{step.title}</h3>
          <p className="text-gray-600 font-sans leading-relaxed mb-6">{step.description}</p>

          {step.serviceId && (
            <div className={cn("rounded p-4 border", isEvent ? "bg-white border-accent/30" : "bg-gray-50 border-gray-100")}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {isEvent ? "Event Details" : "Recommended Service"}
              </h4>
              <div className="flex flex-wrap gap-6">
                {step.date && (
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Calendar className="w-4 h-4 text-accent" /> {step.date}
                  </div>
                )}
                {!isEvent && (
                  <button className="flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
                    <Phone className="w-4 h-4" /> Call Service
                  </button>
                )}
                <button className="flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
                  <MapPin className="w-4 h-4" /> Directions
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block">
           <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:border-accent hover:bg-accent hover:text-primary transition-all" title="Mark as Done">
              <CheckCircle2 className="w-6 h-6" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
