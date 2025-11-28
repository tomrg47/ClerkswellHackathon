import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import logoUrl from "@assets/logo.webp";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-gray-100 py-4 px-4 md:px-8 flex items-center justify-between bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <img src={logoUrl} alt="Restore Hope" className="h-12 md:h-16 object-contain cursor-pointer" />
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-8 items-center">
          <NavLink href="/" active={location === "/"}>Get Help</NavLink>
          <NavLink href="/journey" active={location === "/journey"}>My Journey</NavLink>
          <Link href="/login">
            <a className={cn(
              "font-heading text-sm font-bold tracking-wide transition-all hover:text-accent",
              location === "/login" ? "text-primary" : "text-gray-600"
            )}>
              Log In
            </a>
          </Link>
          <button className="bg-accent text-primary font-heading font-bold px-6 py-2 rounded hover:brightness-105 transition-all">
            Donate
          </button>
        </nav>

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden flex gap-4 items-center">
           <Link href="/login" className="font-heading text-primary font-bold text-sm">Log In</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </main>

      <footer className="bg-primary text-white py-12 px-4 md:px-8 mt-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src={logoUrl} alt="Restore Hope" className="h-12 mb-6 brightness-0 invert opacity-90" />
            <p className="text-sm text-white/80 max-w-sm leading-relaxed font-sans">
              Restore Hope is a charity supporting families in tough situations. We provide dignified, immediate assistance for housing, food, and safety crises.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-accent">Emergency Contacts</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Housing: 020 1234 5678</li>
              <li>Food Bank: 020 8765 4321</li>
              <li>Crisis Team: 111</li>
            </ul>
          </div>
          <div>
             <h4 className="font-heading font-bold text-lg mb-4 text-accent">Menu</h4>
             <nav className="flex flex-col gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-accent transition-colors">Get Help</Link>
                <Link href="/journey" className="hover:text-accent transition-colors">My Journey</Link>
                <Link href="/login" className="hover:text-accent transition-colors">Log In</Link>
                <div className="h-px bg-white/20 my-2"></div>
                <Link href="/admin" className="hover:text-accent transition-colors opacity-70 hover:opacity-100">Staff Portal</Link>
             </nav>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/60">
          © 2024 Restore Hope Charity. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string, active: boolean, children: React.ReactNode }) {
  return (
    <Link href={href}>
      <a className={cn(
        "font-heading text-sm font-bold tracking-wide transition-all hover:text-accent",
        active ? "text-primary border-b-2 border-accent" : "text-gray-600"
      )}>
        {children}
      </a>
    </Link>
  );
}
