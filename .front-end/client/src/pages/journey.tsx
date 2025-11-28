import { useState } from "react";
import Layout from "@/components/Layout";
import { CheckCircle2, Calendar, ArrowRight, AlertCircle, CreditCard, ShoppingBag, QrCode, BookOpen, ExternalLink, Smile, Frown, Meh, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Journey() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full py-12 px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">My Journey</h1>
            <p className="text-xl text-gray-500 font-sans">Welcome back, <span className="font-bold text-primary">Sarah</span></p>
          </div>
          <div className="bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             Family Active
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Digital Membership Card */}
            <section className="bg-gradient-to-br from-primary to-blue-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
               
               <div className="relative z-10 flex-1 w-full">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h2 className="font-heading font-bold text-2xl mb-1 text-white">Pass</h2>
                        <p className="text-white/90 text-sm">Restore Hope Family Pass</p>
                     </div>
                     <CreditCard className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-xs text-white/80 uppercase tracking-wider mb-1">Family Name</p>
                        <p className="font-bold text-lg text-white">The Jenkins Family</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-white/80 uppercase tracking-wider mb-1">Access Level</p>
                        <p className="font-bold text-accent">Supermarket & Events</p>
                     </div>
                  </div>
               </div>

               {/* QR Code Section */}
               <div className="relative z-10 flex flex-col items-center gap-2 shrink-0">
                 <div className="bg-white p-3 rounded-lg shadow-inner">
                   <img 
                     src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RH-MEMBER-SARAH-J-12345" 
                     alt="Member QR Code" 
                     className="w-32 h-32 object-contain"
                   />
                 </div>
                 <p className="text-accent text-lg font-heading font-bold uppercase tracking-wider text-center">pink-unicorn</p>
                 <p className="text-white/60 text-[10px] uppercase tracking-wider text-center">Reference Code</p>
               </div>
            </section>

            {/* Current Focus */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-heading font-bold text-primary">Current Focus</h2>
                <span className="bg-accent/20 text-primary-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-accent/50">Active Step</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-2">
                   <ShoppingBag className="w-6 h-6 text-accent shrink-0 mt-1" />
                   <div>
                      <h3 className="font-bold text-lg text-primary">Weekly Shop</h3>
                      <p className="text-gray-600">Dignity Supermarket Access</p>
                   </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                 <div>
                    <p className="font-bold text-primary mb-1">Visit Dignity Supermarket</p>
                    <p className="text-sm text-gray-600">Open Wed/Thu 10am-12pm. Bring your Dignity Pass.</p>
                 </div>
              </div>
            </section>

            {/* Action Plan Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
               <h2 className="text-2xl font-heading font-bold text-primary mb-6">My Action Plan</h2>
               <div className="space-y-4">
                  <StepItem completed text="Register for membership" />
                  <StepItem completed={false} text="Visit Dignity Supermarket (Wed/Thu)" active />
                  <StepItem completed={false} text="Book Life Skills Course" />
               </div>
            </section>

            {/* Helpful Guides / Wiki */}
            <section>
              <h2 className="text-xl font-heading font-bold text-primary mb-4 flex items-center gap-2">
                 <BookOpen className="w-5 h-5" /> Helpful Guides
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                 <WikiCard 
                    title="Budgeting Basics" 
                    description="Simple tips to make your weekly shop go further."
                    readTime="5 min read"
                 />
                 <WikiCard 
                    title="Low Cost Cooking" 
                    description="Delicious, healthy recipes for under £5."
                    readTime="8 min read"
                 />
                 <WikiCard 
                    title="Energy Saving Tips" 
                    description="How to reduce your bills this winter."
                    readTime="4 min read"
                 />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-primary mb-4">Upcoming Events</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center gap-6 hover:border-accent transition-colors cursor-pointer group mb-4">
                <div className="bg-gray-100 text-primary rounded-lg p-4 text-center min-w-[80px]">
                  <span className="block text-xs uppercase font-bold text-gray-500">Jul</span>
                  <span className="block text-3xl font-heading font-bold">05</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-primary mb-1 group-hover:text-accent transition-colors">Restore Hope Summer</h3>
                  <p className="text-sm text-gray-600 mb-3">Family games, crafts and lunch.</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    Book Space <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             {/* Ally Assistant - Moved to Sidebar */}
             <AllyWidget />

             <div className="bg-primary text-white rounded-lg p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-2xl mb-3">Need to talk?</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">Our drop-in center is open today until 4pm. Come have a tea and a chat.</p>
                  <button className="bg-accent text-primary w-full py-3 rounded font-bold hover:brightness-110 transition-all">
                    Get Directions
                  </button>
                </div>
                {/* Decorative circle */}
                <div className="absolute -bottom-1 -right-1 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             </div>

             <section>
              <h2 className="text-lg font-heading font-bold text-primary mb-4">History</h2>
              <div className="space-y-3">
                <div className="p-4 bg-white border border-gray-100 rounded-lg opacity-75 hover:opacity-100 transition-opacity">
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-bold text-primary">Initial Assessment</span>
                     <span className="text-gray-400 text-xs">Jun 01</span>
                   </div>
                   <p className="text-sm text-gray-600">Membership approved.</p>
                </div>
              </div>
             </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StepItem({ text, completed, active }: { text: string, completed: boolean, active?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded transition-colors border", active ? "bg-white border-primary/20 shadow-sm" : "border-transparent")}>
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0",
        completed ? "bg-green-100 text-green-600" : "bg-gray-200",
        active ? "bg-primary text-white" : ""
      )}>
        {completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
      </div>
      <span className={cn("font-medium", completed ? "text-gray-400 line-through" : "text-gray-700", active && "text-primary font-bold")}>{text}</span>
    </div>
  );
}

function WikiCard({ title, description, readTime }: { title: string, description: string, readTime: string }) {
   return (
      <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-accent hover:shadow-md transition-all cursor-pointer group">
         <h3 className="font-bold text-primary mb-1 group-hover:text-accent transition-colors flex items-center justify-between">
            {title}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
         </h3>
         <p className="text-sm text-gray-600 mb-3">{description}</p>
         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">{readTime}</span>
      </div>
   )
}

function AllyWidget() {
  const [mood, setMood] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || mood) {
      setSubmitted(true);
      // Reset after delay
      setTimeout(() => {
        setSubmitted(false);
        setMood(null);
        setMessage("");
      }, 3000);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
      <div className="p-6 bg-blue-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-blue-50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-blue-100 overflow-hidden flex items-center justify-center">
            <img 
              src="/ally-face.png" 
              alt="Ally Assistant" 
              className="w-full h-full object-cover scale-125"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white z-10"></div>
        </div>
        <div className="flex-1">
          <h2 className="font-heading font-bold text-xl text-primary">Hi Sarah, I'm Ally</h2>
          <p className="text-gray-600 text-sm">How are things going today? I'm here to listen.</p>
        </div>
      </div>

      <div className="p-6">
        {submitted ? (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-primary mb-2">Thanks for sharing</h3>
            <p className="text-gray-600">Your support worker has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">How are you feeling?</label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setMood('good')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all",
                    mood === 'good' 
                      ? "border-accent bg-accent/10 text-primary" 
                      : "border-gray-100 hover:border-accent/50 text-gray-400"
                  )}
                >
                  <Smile className={cn("w-8 h-8", mood === 'good' ? "text-primary" : "text-gray-300")} />
                  <span className="font-bold text-sm">Good</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setMood('okay')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all",
                    mood === 'okay' 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-100 hover:border-primary/30 text-gray-400"
                  )}
                >
                  <Meh className={cn("w-8 h-8", mood === 'okay' ? "text-primary" : "text-gray-300")} />
                  <span className="font-bold text-sm">Okay</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setMood('struggling')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all",
                    mood === 'struggling' 
                      ? "border-primary bg-primary text-white" 
                      : "border-gray-100 hover:border-primary/30 text-gray-400"
                  )}
                >
                  <Frown className={cn("w-8 h-8", mood === 'struggling' ? "text-accent" : "text-gray-300")} />
                  <span className="font-bold text-sm">Struggling</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Any new challenges?</label>
              <div className="relative">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type here..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px] resize-none text-sm"
                />
                <button 
                  type="submit"
                  disabled={!mood && !message.trim()}
                  className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
