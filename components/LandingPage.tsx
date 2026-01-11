import React, { useState, useEffect } from 'react';
import { Cpu, Zap, GitBranch, Play, Terminal, Layers, Menu, X, Youtube, Linkedin, Github, Instagram, ArrowUp, Mail, Globe, Twitter, Shield, FileText } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-[#022c22] text-emerald-50 relative overflow-hidden flex flex-col font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* Animated PCB Background */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 pcb-pattern opacity-40 animate-[pulse_8s_infinite]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
         <div className="scanline"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 flex justify-between items-center border-b border-emerald-900/50 backdrop-blur-md bg-[#022c22]/70 sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="relative">
                <Cpu className="text-yellow-500 group-hover:animate-spin" size={28}/>
                <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-20"></div>
            </div>
            <span className="font-mono-tech text-xl md:text-2xl font-bold tracking-widest text-white group-hover:text-yellow-400 transition-colors">
                NAND<span className="text-emerald-500">ARCHITECT</span>
            </span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-mono text-emerald-400/80 items-center">
            {['MODULES', 'ARCHIVE'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="relative group overflow-hidden px-2 py-1">
                    <span className="group-hover:text-yellow-400 transition-colors z-10 relative">{item}</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </a>
            ))}
             <button 
                onClick={onStart}
                className="relative bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-300 font-bold py-2 px-6 border border-emerald-500/50 hover:border-yellow-400/80 rounded-sm font-mono-tech transition-all group overflow-hidden"
            >
                <span className="relative z-10 group-hover:text-yellow-400 transition-colors">INIT_SYSTEM</span>
                <div className="absolute inset-0 bg-yellow-400/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-emerald-400 hover:text-white transition-colors p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/95 backdrop-blur-xl pt-24 px-8 flex flex-col gap-6 md:hidden animate-in slide-in-from-right duration-300">
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-4 text-emerald-400 hover:text-white">
               <X size={28} />
           </button>
           <a href="#modules" onClick={() => setIsMenuOpen(false)} className="text-2xl font-mono-tech text-emerald-100 hover:text-yellow-400 border-b border-emerald-800 pb-4">MODULES</a>
           <a href="#archive" onClick={() => setIsMenuOpen(false)} className="text-2xl font-mono-tech text-emerald-100 hover:text-yellow-400 border-b border-emerald-800 pb-4">ARCHIVE</a>
           <button 
              onClick={() => { setIsMenuOpen(false); onStart(); }}
              className="mt-8 bg-yellow-500 text-black font-bold py-4 font-mono-tech text-xl shadow-[0_0_20px_rgba(234,179,8,0.4)]"
           >
              ENTER_SYSTEM_
           </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 pt-16 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-8 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span> 
            SYSTEM V1.0 ONLINE
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
          DESIGN<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-glow-gold relative">
            THE LOGIC
            <svg className="absolute -bottom-4 left-0 w-full h-3 text-yellow-500 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-emerald-200/60 max-w-3xl mb-12 leading-relaxed px-4 font-light">
          Master digital architecture. Build complex computational structures from raw silicon. 
          <span className="block mt-4 font-mono text-sm text-yellow-500/80 bg-black/20 inline-block px-2 py-1 rounded border border-yellow-500/10">
              > _INITIATE_PROTOCOL: NAND_ARCHITECT
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4 items-center">
            <button 
                onClick={onStart}
                className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-lg rounded-sm overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] clip-path-polygon"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-wider">
                    INITIALIZE GAME <Play size={20} className="fill-current group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
            
            <a 
              href="https://github.com/vickyiitp"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-emerald-400 hover:text-white transition-colors border-b border-emerald-400/30 hover:border-white pb-1"
            >
               <Github size={18} /> <span>VIEW SOURCE CODE</span>
            </a>
        </div>
      </section>

      {/* Features */}
      <section id="modules" className="relative z-20 bg-[#011812] py-24 px-4 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-4 mb-16 border-b border-emerald-900/50 pb-4">
                <h2 className="font-mono-tech text-4xl text-white">CORE_MODULES</h2>
                <div className="h-1 flex-1 bg-gradient-to-r from-emerald-900 to-transparent mb-2"></div>
                <span className="text-emerald-600 font-mono">01-03</span>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: <GitBranch size={32} />, title: "Logic Synthesis", desc: "Connect primitive gates to construct boolean functions." },
                    { icon: <Layers size={32} />, title: "Abstraction Layers", desc: "Encapsulate logic into integrated circuits (ICs)." },
                    { icon: <Terminal size={32} />, title: "Visual Debugging", desc: "Trace electron flow through your PCB in real-time." }
                ].map((feature, idx) => (
                    <div key={idx} className="bg-[#022c22] border border-emerald-800/50 p-8 rounded-sm hover:border-yellow-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu size={100} />
                        </div>
                        <div className="w-16 h-16 bg-emerald-900/30 rounded flex items-center justify-center mb-6 text-yellow-500 border border-emerald-700 shadow-inner group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 font-mono-tech group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                        <p className="text-emerald-400/60 leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Story */}
      <section id="archive" className="relative z-10 py-24 px-4 bg-[#022c22]">
        <div className="max-w-5xl mx-auto tech-border bg-[#011c16]/80 p-10 md:p-16 relative">
            <div className="absolute -top-3 left-8 text-xs bg-[#022c22] px-2 text-emerald-500 font-mono">ARCHIVE_LOG_2084</div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-32 h-32 relative shrink-0">
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-2 border-yellow-500 rounded-full flex items-center justify-center bg-[#022c22]">
                        <Zap className="text-yellow-500" size={48} />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-mono-tech">THE SILICON FRONTIER</h2>
                    <p className="text-emerald-200/70 mb-6 text-lg leading-relaxed">
                        Legacy microchips have collapsed. As Lead Architect of the Nova Foundry, you must rebuild global computational infrastructure.
                    </p>
                    <p className="text-emerald-200/70 text-lg leading-relaxed border-l-2 border-yellow-500 pl-4">
                         "Prove that the foundations of logic are still sound. The digital age depends on your designs."
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-emerald-900 bg-[#00100d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <div className="font-bold text-white mb-2 font-mono-tech tracking-wider">© 2025 VICKY KUMAR</div>
                <div className="flex flex-col md:flex-row gap-4 text-sm text-emerald-600 font-mono">
                     <span className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setActiveModal('terms')}>TERMS_OF_SERVICE</span>
                     <span className="hidden md:inline">|</span>
                     <span className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => setActiveModal('privacy')}>PRIVACY_POLICY</span>
                </div>
            </div>

            <div className="flex gap-4">
                {[
                    { href: "https://youtube.com/@vickyiitp", icon: <Youtube size={18} /> },
                    { href: "https://linkedin.com/in/vickyiitp", icon: <Linkedin size={18} /> },
                    { href: "https://x.com/vickyiitp", icon: <Twitter size={18} /> },
                    { href: "https://github.com/vickyiitp", icon: <Github size={18} /> }
                ].map((link, i) => (
                    <a 
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-emerald-900/30 border border-emerald-700 flex items-center justify-center text-emerald-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all rounded-sm"
                    >
                        {link.icon}
                    </a>
                ))}
            </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-yellow-500 hover:bg-yellow-400 text-black p-3 shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all duration-500 z-50 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <ArrowUp size={24} />
      </button>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#022c22] border border-emerald-500/30 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl relative">
                <div className="p-4 border-b border-emerald-800 flex justify-between items-center bg-[#011c16]">
                    <h3 className="font-bold text-white font-mono-tech flex items-center gap-2">
                        {activeModal === 'privacy' ? <Shield size={16} className="text-emerald-400"/> : <FileText size={16} className="text-yellow-400"/>}
                        {activeModal === 'privacy' ? 'PRIVACY_POLICY' : 'TERMS_OF_SERVICE'}
                    </h3>
                    <button onClick={closeModal} className="text-emerald-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-8 text-emerald-200/80 text-sm leading-relaxed space-y-4 font-mono">
                    <p>Scanning legal database...</p>
                    <div className="h-px w-full bg-emerald-900 my-4"></div>
                    {activeModal === 'privacy' ? (
                        <>
                            <p>1. DATA_COLLECTION: NULL. Game runs locally.</p>
                            <p>2. STORAGE: Browser LocalStorage used for progress.</p>
                            <p>3. AI_Subsystem: Queries processed via Gemini API. No PII retained.</p>
                        </>
                    ) : (
                        <>
                            <p>1. LICENSE: Provided "AS IS" for educational simulation.</p>
                            <p>2. ASSETS: Copyright 2025 Vicky Kumar.</p>
                            <p>3. LIABILITY: Not responsible for neural overload.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};