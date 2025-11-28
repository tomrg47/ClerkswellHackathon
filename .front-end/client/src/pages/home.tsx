import { useState } from "react";
import Layout from "@/components/Layout";
import CrisisInput from "@/components/CrisisInput";
import ActionPlan from "@/components/ActionPlan";
import { analyzeCrisis, CrisisAssessment } from "@/lib/mock-engine";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<CrisisAssessment | null>(null);

  const handleCrisisSubmit = async (text: string) => {
    setIsLoading(true);
    try {
      const result = await analyzeCrisis(text);
      setAssessment(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col py-12 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="w-full max-w-5xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!assessment ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 text-center"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-primary tracking-tight">
                  How can we help <br/>
                  <span className="text-accent">you today?</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-sans font-medium leading-relaxed">
                  We are here to support you through tough situations. Tell us what is happening, and we will guide you to the right help.
                </p>
                
                <div className="pt-8">
                  <CrisisInput onSubmit={handleCrisisSubmit} isLoading={isLoading} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="plan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ActionPlan assessment={assessment} onReset={() => setAssessment(null)} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </Layout>
  );
}
