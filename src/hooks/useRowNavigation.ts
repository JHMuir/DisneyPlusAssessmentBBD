import { useState, useEffect } from "react";
import type {Set} from "../types/types";

const DEBOUNCE_MS = 50;

export function useRowNavigation(rows: Set[]) {
    const [activeRowIndex, setActiveRowIndex] = useState(0);

    useEffect(() => {
        let isProcessing = false;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isProcessing) return;
            isProcessing = true;
            setTimeout(() => {isProcessing = false;}, DEBOUNCE_MS);

            switch(event.key) {
                case "ArrowUp":
                case "w":
                    event.preventDefault();
                    setActiveRowIndex(prev => Math.max(0, prev - 1));
                    break;
                case "ArrowDown":
                case "s":
                    event.preventDefault();
                    setActiveRowIndex(prev => Math.min(rows.length - 1, prev + 1));
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeRowIndex, rows]);
    return activeRowIndex
}