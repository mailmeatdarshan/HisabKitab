import React, { useState, useEffect, useCallback, memo } from 'react';
import { useSettings, FONTS } from '../context/SettingsContext';
import { Sun, Moon, RotateCcw, Maximize, CheckCircle2, User, Download, Smartphone } from 'lucide-react';
import axiosInstance from '../utils/data-access';
import { isUserAuthenticated } from '../utils/local-storage-helper';
import { motion, AnimatePresence } from 'framer-motion';

const Badge = memo(({ text, isDark }) => (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ml-2 ${
        isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-600'
    }`}>
        {text}
    </span>
));

const Kbd = memo(({ children, isDark }) => (
    <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono mx-1 shadow-sm border ${
        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
    }`}>
        {children}
    </span>
));

const ToggleSwitch = memo(({ enabled, onChange, label }) => (
    <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border border-black/10 dark:border-white/10 transition-colors duration-200 ease-in-out focus:outline-none p-0.5"
        style={{
            backgroundColor: enabled ? '#00C58D' : '#CBD5E1',
            boxShadow: enabled ? '0 0 12px rgba(0, 197, 141, 0.4)' : 'none',
        }}
        title={label || (enabled ? 'Enabled' : 'Disabled')}
    >
        <span
            aria-hidden="true"
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out"
            style={{
                transform: enabled ? 'translateX(20px)' : 'translateX(2px)',
                marginTop: '1px'
            }}
        />
    </button>
));

const SmartSlider = memo(({ initialValue, min, max, step, onCommit, formatLabel, isDark }) => {
    const [val, setVal] = useState(initialValue);

    useEffect(() => {
        setVal(initialValue);
    }, [initialValue]);

    const handleChange = useCallback((e) => {
        const next = parseFloat(e.target.value);
        setVal(next);
        onCommit(next);
    }, [onCommit]);

    const percentage = ((val - min) / (max - min)) * 100;

    return (
        <div className="flex items-center gap-4 w-full sm:w-[280px]">
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step}
                value={val}
                onChange={handleChange}
                className="sleek-slider flex-1 cursor-pointer"
                style={{ 
                    height: '4px',
                    borderRadius: '2px',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: isDark
                        ? `linear-gradient(to right, #00C58D ${percentage}%, #333333 ${percentage}%)`
                        : `linear-gradient(to right, #00C58D ${percentage}%, #E2E8F0 ${percentage}%)`
                }}
            />
            <span className={`text-[13px] font-bold font-mono w-[48px] text-right ${isDark ? 'text-[#F0F0F0]' : 'text-slate-800'}`}>
                {formatLabel(val)}
            </span>
        </div>
    );
});

const SettingBlock = memo(({ title, description, children, isDark }) => (
    <div className={`flex flex-col md:flex-row w-full mb-6 rounded-2xl shadow-sm border transition-colors overflow-hidden ${
        isDark 
            ? 'border-[#2A2A2A] bg-[#151515]' 
            : 'border-slate-200 bg-white'
    }`}>
        <div className={`w-full md:w-[260px] shrink-0 p-5 md:p-6 border-b md:border-b-0 md:border-r ${
            isDark ? 'border-[#2A2A2A]' : 'border-slate-100'
        }`}>
            <h3 className={`text-[15px] font-semibold mb-1.5 ${isDark ? 'text-[#F0F0F0]' : 'text-slate-900'}`}>{title}</h3>
            <p className={`text-[12px] leading-relaxed m-0 ${isDark ? 'text-[#8A8A8A]' : 'text-slate-500'}`}>{description}</p>
        </div>
        <div className="flex-1 flex flex-col">
            {children}
        </div>
    </div>
));

const SettingRow = memo(({ title, description, children, isLast = false, isDark }) => (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-6 gap-4 md:gap-6 transition-colors duration-200 ${
        isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/50'
    } ${isLast ? '' : isDark ? 'border-b border-[#2A2A2A]' : 'border-b border-slate-100'}`}>
        <div className="flex-1">
            <h4 className={`text-[14px] font-medium mb-1 ${isDark ? 'text-[#F0F0F0]' : 'text-slate-800'}`}>{title}</h4>
            {description && <p className={`text-[12px] m-0 ${isDark ? 'text-[#8A8A8A]' : 'text-slate-500'}`}>{description}</p>}
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-start sm:justify-end shrink-0">
            {children}
        </div>
    </div>
));

const FontCard = memo(({ selected, onClick, font, isDark }) => (
    <div 
        className={`w-full aspect-square rounded-xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
            selected 
                ? isDark 
                    ? 'border-[#00C58D] bg-[#00C58D]/10 ring-1 ring-[#00C58D] shadow-sm' 
                    : 'border-[#00C58D] bg-[#00C58D]/5 ring-1 ring-[#00C58D] shadow-sm'
                : isDark 
                    ? 'border-[#2A2A2A] bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40' 
                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/60'
        }`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between w-full">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                selected ? 'text-[#00C58D]' : isDark ? 'text-zinc-500' : 'text-slate-400'
            }`}>
                {font.desc}
            </span>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                selected 
                    ? 'border-[#00C58D] bg-[#00C58D]' 
                    : isDark ? 'border-zinc-600' : 'border-slate-300'
            }`}>
                {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
        </div>
        
        <div 
            className={`text-3xl sm:text-4xl my-auto text-center font-bold select-none transition-colors ${
                selected 
                    ? isDark ? 'text-white' : 'text-slate-900' 
                    : isDark ? 'text-zinc-300' : 'text-slate-800'
            }`}
            style={{
                fontFamily: font.id === 'Inter' ? "'Inter', sans-serif" :
                            font.id === 'Playfair' ? "'Playfair Display', serif" :
                            font.id === 'SpaceMono' ? "'Space Mono', monospace" :
                            font.id === 'Righteous' ? "'Righteous', cursive" :
                            font.id === 'Cinzel' ? "'Cinzel', serif" :
                            font.id === 'Caveat' ? "'Caveat', cursive" :
                            font.id === 'ChakraPetch' ? "'Chakra Petch', sans-serif" :
                            font.id === 'Bangers' ? "'Bangers', cursive" : 'sans-serif'
            }}
        >
            Aa
        </div>

        <div className="text-center">
            <div className={`text-xs font-semibold ${
                selected ? 'text-[#00C58D]' : isDark ? 'text-zinc-300' : 'text-slate-700'
            }`}>
                {font.name}
            </div>
        </div>
    </div>
));

export default function SettingsPanel() {
    const {
        theme,
        toggleTheme,
        fontFamily,
        setFontFamily,
        fontSizeMultiplier,
        setFontSizeMultiplier,
        textBrightness,
        setTextBrightness,
        resetDefaults
    } = useSettings();

    const isDark = theme === 'dark';
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.get('/auth/me')
                .then(res => {
                    if (res.data?.data) {
                        setProfile({
                            name: res.data.data.name || '',
                            email: res.data.data.email || ''
                        });
                    }
                })
                .catch(() => {});
        }
    }, []);

    const showToast = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }, []);

    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        if (window.deferredInstallPrompt) {
            setInstallPrompt(window.deferredInstallPrompt);
        }

        const handleBeforeInstall = (e) => {
            e.preventDefault();
            window.deferredInstallPrompt = e;
            setInstallPrompt(e);
        };

        const handlePromptReady = () => {
            if (window.deferredInstallPrompt) {
                setInstallPrompt(window.deferredInstallPrompt);
            }
        };

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('pwa-prompt-ready', handlePromptReady);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('pwa-prompt-ready', handlePromptReady);
        };
    }, []);

    const handleInstallClick = async () => {
        const promptToUse = installPrompt || window.deferredInstallPrompt;
        if (promptToUse) {
            promptToUse.prompt();
            const { outcome } = await promptToUse.userChoice;
            if (outcome === 'accepted') {
                showToast('HisabKitab app installed successfully!');
                setInstallPrompt(null);
                window.deferredInstallPrompt = null;
                setIsInstalled(true);
            }
        } else {
            showToast('To install: Tap browser menu (⋮ or Share) > Add to Home screen');
        }
    };

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    }, []);

    // Keyboard shortcut F for fullscreen (Parkin-son behavior)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key.toLowerCase() === 'f') {
                e.preventDefault();
                toggleFullscreen();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleFullscreen]);

    const formatPercent = useCallback((v) => `${Math.round(v * 100)}%`, []);

    return (
        <div className="max-w-4xl mx-auto pb-16 relative">
            {/* Toast notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold z-50 pointer-events-none"
                    >
                        <CheckCircle2 className="w-4 h-4 text-[#00C58D]" />
                        <span>{toast}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        App Preferences & Settings
                    </h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Personalize theme, typography style, interface scaling, and display preferences.
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetDefaults();
                        showToast("Settings reset to defaults!");
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer shadow-sm ${
                        isDark 
                            ? 'border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700' 
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                    title="Reset all settings to default"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                </button>
            </div>

            {/* Section 1: Appearance & Theme */}
            <SettingBlock
                title="Appearance & Theme"
                description="Choose between Clean Light Mode and Obsidian Dark Mode."
                isDark={isDark}
            >
                <SettingRow
                    title="Theme Mode"
                    description="Light Mode is the active default. Toggle on to activate Obsidian Dark Mode."
                    isLast={true}
                    isDark={isDark}
                >
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                            {isDark ? (
                                <>
                                    <Moon className="w-4 h-4 text-amber-400" />
                                    <span>Dark Mode</span>
                                </>
                            ) : (
                                <>
                                    <Sun className="w-4 h-4 text-amber-500" />
                                    <span>Light Mode</span>
                                </>
                            )}
                        </span>
                        <ToggleSwitch
                            enabled={isDark}
                            onChange={() => {
                                toggleTheme();
                                showToast(isDark ? "Switched to Light Mode" : "Switched to Dark Mode");
                            }}
                            label="Toggle Theme"
                        />
                    </div>
                </SettingRow>
            </SettingBlock>

            {/* Section 2: Typography Style */}
            <SettingBlock
                title="Typography Style"
                description="Select your preferred typeface. Changes reflect instantly across every module."
                isDark={isDark}
            >
                <div className="p-5 md:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {FONTS.map((font) => (
                            <FontCard
                                key={font.id}
                                font={font}
                                selected={fontFamily === font.id}
                                onClick={() => {
                                    setFontFamily(font.id);
                                    showToast(`Font updated to ${font.name}`);
                                }}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>
            </SettingBlock>

            {/* Section 3: Interface Display */}
            <SettingBlock
                title="Interface Display"
                description="Customize text sizing, UI zoom, and display brightness."
                isDark={isDark}
            >
                <SettingRow
                    title="Interface Scale"
                    description="Adjust the overall sizing of cards, text, and interactive buttons."
                    isDark={isDark}
                >
                    <SmartSlider 
                        initialValue={fontSizeMultiplier || 1}
                        min={0.85} 
                        max={1.25} 
                        step={0.05} 
                        onCommit={(val) => setFontSizeMultiplier(val)}
                        formatLabel={formatPercent}
                        isDark={isDark}
                    />
                </SettingRow>

                <SettingRow
                    title="Display Brightness"
                    description="Calibrate interface brightness to reduce eye strain in low-light environments."
                    isLast={true}
                    isDark={isDark}
                >
                    <SmartSlider 
                        initialValue={textBrightness || 1}
                        min={0.70} 
                        max={1.30} 
                        step={0.05} 
                        onCommit={(val) => setTextBrightness(val)}
                        formatLabel={formatPercent}
                        isDark={isDark}
                    />
                </SettingRow>
            </SettingBlock>

            {/* Section 4: Fullscreen Shortcut (From Parkin-son) */}
            <SettingBlock
                title="Fullscreen Mode"
                description="Quickly maximize or restore screen view for presentation or deep focus."
                isDark={isDark}
            >
                <SettingRow
                    title={
                        <div className="flex items-center">
                            <span>Fullscreen Shortcut</span>
                            <Badge text="Desktop" isDark={isDark} />
                        </div>
                    }
                    description={
                        <span>
                            Press the <Kbd isDark={isDark}>F</Kbd> key on your keyboard to enter or exit fullscreen anytime.
                        </span>
                    }
                    isLast={true}
                    isDark={isDark}
                >
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer shadow-sm ${
                            isDark 
                                ? 'border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700' 
                                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <Maximize className="w-3.5 h-3.5" />
                        <span>Toggle Fullscreen</span>
                    </button>
                </SettingRow>
            </SettingBlock>

            {/* Section 5: Account Profile (From Parkin-son) */}
            <SettingBlock
                title="Account Profile"
                description="Your account information and credentials."
                isDark={isDark}
            >
                <SettingRow
                    title="User Status"
                    description={isUserAuthenticated() ? "Authenticated user session active." : "Operating in local guest session."}
                    isDark={isDark}
                >
                    <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${isUserAuthenticated() ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <span className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                            {isUserAuthenticated() ? 'Online Cloud Sync' : 'Guest Local Mode'}
                        </span>
                    </div>
                </SettingRow>

                {isUserAuthenticated() && profile.email && (
                    <SettingRow
                        title="Email Address"
                        description="Linked account identifier for summary emails and reports."
                        isLast={true}
                        isDark={isDark}
                    >
                        <span className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border ${
                            isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}>
                            {profile.email}
                        </span>
                    </SettingRow>
                )}
            </SettingBlock>

            {/* Section 6: Progressive Web App (PWA) */}
            <SettingBlock
                title="Application Install (PWA)"
                description="Install HisabKitab on your phone or desktop for quick, full-screen native launching."
                isDark={isDark}
            >
                <SettingRow
                    title={
                        <div className="flex items-center">
                            <span>Install Native App</span>
                            <Badge text={isInstalled ? "Installed" : "PWA Ready"} isDark={isDark} />
                        </div>
                    }
                    description="Launch instantly from your phone home screen or PC dock without browser bars."
                    isLast={true}
                    isDark={isDark}
                >
                    <button
                        type="button"
                        onClick={handleInstallClick}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#00C58D] hover:bg-[#00b07e] transition cursor-pointer shadow-sm shadow-[#00C58D]/25"
                    >
                        {isInstalled ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{isInstalled ? "App Installed" : "Install App"}</span>
                    </button>
                </SettingRow>
            </SettingBlock>
        </div>
    );
}
