import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreenShare } from '../hooks/useScreenShare';
import { Button } from '../components/Button';

export const ScreenTest: React.FC = () => {
    const navigate = useNavigate();
    const { state, stream, error, startSharing, stopSharing, metadata } = useScreenShare();
    const videoRef = useRef<HTMLVideoElement>(null);

    // Update video element srcObject when stream changes
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            // Explicitly call play to handle potential browser autoplay restrictions
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
    }, [stream]);

    // Handle tab visibility changes to recover from potential stalling
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible' && videoRef.current && stream) {
                videoRef.current.play().catch(e => console.error("Visibility change play failed:", e));
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [stream]);

    const getStateTheme = () => {
        switch (state) {
            case 'idle': return { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' };
            case 'requesting': return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
            case 'granted': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
            case 'cancelled':
            case 'denied': return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
            case 'ended': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
            default: return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
        }
    };

    const theme = getStateTheme();

    return (
        <div className="min-h-screen w-full flex flex-col p-6 md:p-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="group text-slate-500 hover:text-white transition-all flex items-center gap-2 mb-3 text-sm font-bold uppercase tracking-widest"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </button>
                    <h1 className="text-4xl font-black text-white tracking-tight">Screen Test Console</h1>
                </div>

                <div className={`glass px-6 py-4 rounded-2xl flex items-center gap-4 border-l-4 ${theme.border} transition-all duration-500`}>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Session Status</span>
                        <div className={`flex items-center gap-3 font-mono font-bold ${theme.color}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${state === 'granted' ? 'animate-pulse bg-current' : 'bg-slate-700 shadow-inner'}`}></span>
                            <span className="capitalize">{state === 'idle' ? 'Ready' : state.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-grow items-start pb-10">
                {/* Sidebar Controls */}
                <div className="xl:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                    <section className="glass p-6 rounded-3xl">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Execution
                        </h3>
                        {state === 'granted' ? (
                            <Button variant="danger" onClick={stopSharing} className="w-full justify-center">
                                Stop Session
                            </Button>
                        ) : (
                            <Button
                                onClick={startSharing}
                                isLoading={state === 'requesting'}
                                className="w-full justify-center shadow-lg"
                            >
                                {state === 'idle' ? 'Initialize Stream' : 'Restart Stream'}
                            </Button>
                        )}
                    </section>

                    {metadata && (
                        <section className="glass p-6 rounded-3xl animate-in zoom-in duration-500">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Hardware Telemetry
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-slate-500 block mb-2">Resolution</label>
                                    <p className="font-mono text-xl font-bold text-white tracking-tighter">{metadata.resolution}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-slate-500 block mb-2">Surface Type</label>
                                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 inline-block">
                                        <p className="text-slate-300 text-sm font-bold capitalize">{metadata.displaySurface}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-slate-500 block mb-2">Source Label</label>
                                    <p className="text-slate-400 text-xs italic leading-snug">{metadata.label}</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {error && (
                        <section className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 animate-in shake duration-500">
                            <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-2 font-mono">System Exception</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">{error}</p>
                        </section>
                    )}
                </div>

                {/* Studio Preview */}
                <div className="xl:col-span-3 h-full min-h-[500px] flex flex-col group animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                    <div className="relative flex-grow bg-slate-950 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-700 group-hover:border-slate-700">
                        {/* Visual Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                        {state === 'granted' ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="relative z-10 w-full h-full object-contain"
                            />
                        ) : (
                            <div className="relative z-10 text-center p-12 max-w-md">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    {state === 'idle' ? 'Initialize Studio' : 'Stream Terminated'}
                                </h2>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {state === 'idle'
                                        ? 'The preview engine is in standby. Click initialize to begin capturing your display.'
                                        : 'The hardware connection was severed or permission was revoked. Please re-authenticate the stream.'}
                                </p>
                            </div>
                        )}

                        {/* Live Indicator Overlay */}
                        {state === 'granted' && (
                            <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
                                <div className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl border border-red-500/50">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    Studio Live
                                </div>
                                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white/70 border border-white/10">
                                    REC_ENABLED: FALSE
                                </div>
                            </div>
                        )}

                        {/* Corner Decorative Elements */}
                        <div className="absolute top-0 right-0 p-8 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">
                        <div className="flex gap-4">
                            <span>API_STATUS: OK</span>
                            <span className="text-emerald-500">MEDIA_DEVICES: READY</span>
                        </div>
                        <div className="flex gap-4">
                            <span>ENCRYPTION: NATIVE_TLS</span>
                            <span>SECURE_CONTEXT: YES</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
