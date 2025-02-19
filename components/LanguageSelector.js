import React from 'react';

// The LanguageSelector component allows users to change the language of the application
const LanguageSelector = ({ currentLang, onChange }) => {

    // This function handles the change of language, updates the parent component and stores the language in localStorage
    const handleLanguageChange = (newLang) => {
        onChange(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <img
                src="/flag_uk.png"
                alt="English"
                style={{
                    width: '50px',
                    height: '30px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    marginRight: '5px',
                    border: currentLang === 'en' ? '2px solid #1976D2' : 'none',
                }}
                onClick={() => handleLanguageChange('en')}
            />

            <img
                src="/flag_french.png"
                alt="Français"
                style={{
                    width: '50px',
                    height: '30px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    marginRight: '5px',
                    border: currentLang === 'fr' ? '2px solid #1976D2' : 'none',
                }}
                onClick={() => handleLanguageChange('fr')}
            />
        </div>
    );
};

export default LanguageSelector;
