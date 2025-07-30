// React Hook that handles row navigation and user input
import { useEffect, useReducer } from "react";

const DEBOUNCE_MS = 50;

interface NavState {
    activeRowIndex: number;
    selectedCardIndex: number;
    showOverlay: boolean;
}

type NavAction = 
    {input: "MOVE"; direction: "UP" | "DOWN" | "LEFT" | "RIGHT" } 
    | {input: "OPEN_OVERLAY"}
    | {input: "CLOSE_OVERLAY"};

function navReducer(state: NavState, action: NavAction, contentRows: any[]): NavState {
    if(action.input === "OPEN_OVERLAY") {
        if(!state.showOverlay){
            return {...state, showOverlay: true};
        } else {
            return state;
        }
    }
    if(action.input === "CLOSE_OVERLAY") {
        if(state.showOverlay) {
            return {...state, showOverlay: false};
        } else {
            return state;
        }
    }
    if(state.showOverlay) return state;

    const activeRow = contentRows[state.activeRowIndex];
    const maxCards = activeRow ? activeRow.items.length - 1 : 0;

    switch (action.direction) {
        case "UP":
            return {
                ...state,
                activeRowIndex: Math.max(0, state.activeRowIndex - 1),
                selectedCardIndex: 0,
            };
        case "DOWN":
            return {
                ...state,
                activeRowIndex: Math.min(contentRows.length - 1, state.activeRowIndex + 1),
                selectedCardIndex: 0,
            };
        case "LEFT":
            return {
                ...state,
                selectedCardIndex: Math.max(0, state.selectedCardIndex - 1),
            }
        case "RIGHT":
            return {
                ...state,
                selectedCardIndex: Math.min(maxCards, state.selectedCardIndex + 1),
            }
        default:
            return state;
    }
}

export function useKeyboardNavigation(contentRows: any[]) {
    const [state, dispatch] = useReducer(
        (state: NavState, action:NavAction) => navReducer(state, action, contentRows), 
        {activeRowIndex: 0, selectedCardIndex: 0, showOverlay: false}
    );

    useEffect(() => {
        let isProcessing = false;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isProcessing) return;
            isProcessing = true;
            setTimeout(() => {isProcessing = false;}, DEBOUNCE_MS);

            const keyMap: Record<string, NavAction> = {
                // Indexing contentRows array inside App.tsx (changing the rendered row)
                "ArrowUp": {input: "MOVE", direction: "UP"},
                "w": {input: "MOVE", direction: "UP"},
                "ArrowDown": {input: "MOVE", direction: "DOWN"},
                "s": {input: "MOVE", direction: "DOWN"},

                // Indexing the cards array inside CardRow.tsx (changing the selected card)
                "ArrowLeft": {input: "MOVE", direction: "LEFT"},
                "a": {input: "MOVE", direction: "LEFT"},
                "ArrowRight": {input: "MOVE", direction: "RIGHT"},
                "d": {input: "MOVE", direction: "RIGHT"},

                // Opening/Closing the CardOverlay
                "Enter": {input: "OPEN_OVERLAY"},
                "Escape": {input: "CLOSE_OVERLAY"},
            };

            const userAction = keyMap[event.key];
            if (userAction){
                event.preventDefault();
                dispatch(userAction);
            }

            
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    },[contentRows]);
    return state;
}