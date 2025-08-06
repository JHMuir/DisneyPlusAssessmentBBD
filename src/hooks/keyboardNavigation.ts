// React Hook that handles row navigation and user input

import { useState, useEffect } from "react";

export function keyboardNavigation(contentRows: any[]) {
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        let isProcessing = false;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isProcessing) return;
            isProcessing = true;

            setTimeout(() => {isProcessing = false;}, 50);

            const activeRow = contentRows[activeRowIndex];
            const maxCards = activeRow ? activeRow.items.length - 1 : 0;
            switch(event.key){
                case "ArrowUp" || "w":
                    event.preventDefault();
                    if(!showOverlay) {
                        setActiveRowIndex(prev => Math.max(0, prev - 1));
                        setSelectedCardIndex(0);
                    }
                    break;
                case "ArrowDown" || "s":
                    event.preventDefault();
                    if(!showOverlay) {
                        setActiveRowIndex(prev => Math.min(contentRows.length - 1, prev + 1));
                        setSelectedCardIndex(0);
                    }
                    break;
                case "ArrowLeft" || "a":
                    event.preventDefault();
                    if(!showOverlay) {
                        setSelectedCardIndex(prev => Math.max(0, prev - 1));
                    }
                    break;
                case "ArrowRight" || "d":
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
    },[activeRowIndex, selectedCardIndex, showOverlay, contentRows]);
    return {activeRowIndex, selectedCardIndex, showOverlay}
}