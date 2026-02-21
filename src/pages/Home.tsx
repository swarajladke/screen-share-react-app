import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [supportError, setSupportError] = useState<string | null>(null);

    const checkSupportAndNavigate = () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            setSupportError("Your browser doesn't support the Screen Capture API (getDisplayMedia). Please use a modern desktop browser.");
            return;
        }
        navigate('/screen-test');
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-5xl w-full text-center">
                <header className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                        Native Web API v1.0
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-tight">
                        Screen Share <br />
                        <span className="text-gradient">Test App</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        Verify navigator.mediaDevices.getDisplayMedia support and monitor media stream lifecycle.
                    </p>

                    <div className="flex flex-col items-center gap-6">
                        {supportError ? (
                            <div className="glass p-6 rounded-2xl border-red-500/30 max-w-lg">
                                <p className="text-red-400 font-semibold mb-2 flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Browser Unsupported
                                </p>
                                <p className="text-slate-400 text-sm">{supportError}</p>
                            </div>
                        ) : (
                            <Button onClick={checkSupportAndNavigate} size="lg" className="shadow-premium group">
                                Start Screen Test
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        )}
                        <p className="text-slate-500 text-xs font-mono">Requires secure context (HTTPS) or Localhost</p>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    {[
                        { title: "Lifecycle Hooks", desc: "Real-time state tracking from idle to termination.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                        { title: "Media Profiling", desc: "Inspect track constraints, resolution, and surface types.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" },
                        { title: "Fault Tolerance", desc: "Handling permission denials and unexpected interruptions.", icon: "M12 15v2m0 0v2m0-2h2m-2 0H10m11-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2z" }
                    ].map((item, i) => (
                        <div key={i} className="glass p-8 rounded-3xl text-left hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-2">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};
