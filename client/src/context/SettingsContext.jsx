import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();
export const useSettings = () => useContext(SettingsContext);

export const FONTS = [
    { id: 'Inter', name: 'Inter', desc: 'Clean & modern' },
    { id: 'Playfair', name: 'Playfair', desc: 'Elegant serif' },
    { id: 'SpaceMono', name: 'Space Mono', desc: 'Tech monospace' },
    { id: 'Righteous', name: 'Righteous', desc: 'Modern geometric' },
    { id: 'Cinzel', name: 'Cinzel', desc: 'Classic editorial' },
    { id: 'Caveat', name: 'Caveat', desc: 'Casual script' },
    { id: 'ChakraPetch', name: 'Chakra Petch', desc: 'Sporty technical' },
    { id: 'Bangers', name: 'Bangers', desc: 'Bold expressive' }
];

export const SettingsProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('hk_theme') || 'light');
    const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('hk_fontFamily') || 'Inter');
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(() => parseFloat(localStorage.getItem('hk_fontSize')) || 1);
    const [textBrightness, setTextBrightness] = useState(() => parseFloat(localStorage.getItem('hk_textBrightness')) || 1);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const resetDefaults = () => {
        setTheme('light');
        setFontFamily('Inter');
        setFontSizeMultiplier(1);
        setTextBrightness(1);
    };

    useEffect(() => {
        localStorage.setItem('hk_theme', theme);
        localStorage.setItem('hk_fontFamily', fontFamily);
        localStorage.setItem('hk_fontSize', fontSizeMultiplier);
        localStorage.setItem('hk_textBrightness', textBrightness);

        // Apply dark class to html document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Map fonts for the entire App
        const fontMap = {
            'Inter': "'Inter', sans-serif",
            'Playfair': "'Playfair Display', serif",
            'SpaceMono': "'Space Mono', monospace",
            'Righteous': "'Righteous', cursive",
            'Cinzel': "'Cinzel', serif",
            'Caveat': "'Caveat', cursive",
            'ChakraPetch': "'Chakra Petch', sans-serif",
            'Bangers': "'Bangers', cursive"
        };

        const selectedFont = fontMap[fontFamily] || fontMap['Inter'];

        // Inject font style element
        let styleEl = document.getElementById('global-hisabkitab-font-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'global-hisabkitab-font-style';
            document.head.appendChild(styleEl);
        }

        styleEl.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Chakra+Petch:wght@600&family=Cinzel:wght@700&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600&family=Righteous&family=Space+Mono:wght@700&family=Bangers&display=swap');
            
            body, button, input, select, textarea {
                font-family: ${selectedFont} !important;
            }
        `;

        // Scale UI smoothly if needed
        document.body.style.zoom = fontSizeMultiplier;

        // Apply brightness filter smoothly
        document.body.style.filter = `brightness(${textBrightness})`;

    }, [theme, fontFamily, fontSizeMultiplier, textBrightness]);

    return (
        <SettingsContext.Provider value={{
            theme,
            setTheme,
            toggleTheme,
            fontFamily,
            setFontFamily,
            fontSizeMultiplier,
            setFontSizeMultiplier,
            textBrightness,
            setTextBrightness,
            resetDefaults
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
