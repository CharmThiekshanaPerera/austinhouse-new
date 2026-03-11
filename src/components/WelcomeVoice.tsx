import { useEffect, useRef } from 'react';

const WelcomeVoice = () => {
    const hasSpoken = useRef(false);

    useEffect(() => {
        // Check if we've already spoken in this session to avoid repeating on reloads
        const spokenInSession = sessionStorage.getItem('welcomeVoiceSpoken');

        if (spokenInSession) {
            hasSpoken.current = true;
            return;
        }

        const handleInteraction = () => {
            if (!hasSpoken.current && 'speechSynthesis' in window) {
                // Customize the welcome message here
                const message = new SpeechSynthesisUtterance("Welcome to Austin House");

                // Try to select a good voice (preferably english)
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(v => v.lang === "en-US" || v.lang === "en-GB") || voices[0];

                if (preferredVoice) {
                    message.voice = preferredVoice;
                }

                // Adjust properties for a more natural, welcoming tone
                message.rate = 0.9;
                message.pitch = 1.0;
                message.volume = 1.0;

                window.speechSynthesis.speak(message);

                hasSpoken.current = true;
                sessionStorage.setItem('welcomeVoiceSpoken', 'true');

                // Cleanup all events since we only want to trigger this once
                cleanup();
            }
        };

        const cleanup = () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        // Browsers require user interaction before playing audio or speech
        // So we listen for the first interaction to trigger the voice
        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        // Initial check for voices to load them
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }

        return cleanup;
    }, []);

    // This component doesn't render any visible UI
    return null;
};

export default WelcomeVoice;
