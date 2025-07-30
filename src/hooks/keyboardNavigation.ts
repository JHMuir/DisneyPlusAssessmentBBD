// React Hook that handles row navigation and user input

import { useState, useEffect } from "react";

const DEBOUNCE_MS = 50;

export function keyboardNavigation(contentRows: any[]) {
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        let isProcessing = false;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isProcessing) return;
            isProcessing = true;

            setTimeout(() => {isProcessing = false;}, DEBOUNCE_MS);

            const activeRow = contentRows[activeRowIndex];
            const maxCards = activeRow ? activeRow.items.length - 1 : 0;
            switch(event.key){
                case "ArrowUp":
                case "w":
                    event.preventDefault();
                    if(!showOverlay) {
                        setActiveRowIndex(prev => Math.max(0, prev - 1));
                        setSelectedCardIndex(0);
                    }
                    break;
                case "ArrowDown":
                case "s":
                    event.preventDefault();
                    if(!showOverlay) {
                        setActiveRowIndex(prev => Math.min(contentRows.length - 1, prev + 1));
                        setSelectedCardIndex(0);
                    }
                    break;
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
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    },[activeRowIndex, selectedCardIndex, showOverlay, contentRows, contentRows.length]);
    return {activeRowIndex, selectedCardIndex, showOverlay}
}