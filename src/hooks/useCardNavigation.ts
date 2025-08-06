import { useState, useEffect } from "react";
import type { Cards } from "../types/types";

const DEBOUNCE_MS = 50;

export function useCardNavigation(cards: Cards) {
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        let isProcessing = false;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isProcessing) return;
            isProcessing = true;
            setTimeout(() => {isProcessing = false;}, DEBOUNCE_MS);
            
            const maxCards = cards ? cards.length - 1 : 0;
            switch(event.key) {
                case "ArrowLeft":
                case "a":
                    event.preventDefault();
                    if(!showOverlay) {
                        setSelectedCardIndex(prev => Math.max(0, prev - 1));
                    }
                    break;
                case "ArrowRight": 
                case "d":
                    event.preventDefault();
                    if(!showOverlay) {
                        setSelectedCardIndex(prev => Math.min(maxCards, prev + 1));
                    }
                    break;
                case "Enter":
                    if(!showOverlay){
                        event.preventDefault();
                        setShowOverlay(true);
                    }
                    break;
                case "Escape":
                    if(showOverlay){
                        event.preventDefault();
                        setShowOverlay(false);
                    }
                    break;
                default:
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedCardIndex, showOverlay, cards]);
    return {selectedCardIndex, showOverlay};
}