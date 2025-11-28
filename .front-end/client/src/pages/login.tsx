import { useState } from "react";
import Layout from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((method === 'phone' && phone.trim()) || (method === 'email' && email.trim())) {
      setIsLoading(true);
      // Mock login delay
      setTimeout(() => {
        setIsLoading(false);
        setLocation("/journey");
      }, 1000);
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-gray-600 font-sans">Enter your details to access your account.</p>
          </div>

          <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
            <button 
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 text-sm font-bold uppercase tracking-wide ${method === 'phone' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Phone
            </button>
            <button 
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-sm font-bold uppercase tracking-wide ${method === 'email' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Email
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {method === 'phone' ? (
              <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wide">Mobile Number</label>
                <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                   <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07700 900000"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-lg"
                      autoFocus
                   />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                   <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-lg"
                      autoFocus
                   />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || (method === 'phone' ? !phone.trim() : !email.trim())}
              className="w-full bg-primary text-white py-4 rounded font-heading font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                "Checking..."
              ) : (
                <>
                  Log In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Don't have an account? <Link href="/"><a className="text-primary font-bold underline hover:text-accent">Get Help</a></Link> to start.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
