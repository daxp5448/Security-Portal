import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'EN');

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const toggleLang = () => {
        // Cycle through all Indian languages
        const languages = ['EN', 'HI', 'BN', 'TE', 'MR', 'TA', 'GU', 'KN', 'ML', 'PA', 'OR'];
        const currentIndex = languages.indexOf(lang);
        const nextIndex = (currentIndex + 1) % languages.length;
        setLang(languages[nextIndex]);
    };

    // Translation helper function
    // Usage: t('home.heroTitle')
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[lang];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key; // Return key if translation missing
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
