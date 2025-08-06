import {useEffect, type RefObject} from 'react';

export function useHorizontalScroll(selectedCardIndex: number, containerRef: RefObject<HTMLDivElement | null>, cardRefs: RefObject<(HTMLDivElement | null)[]>){
    useEffect(() => {
        if (selectedCardIndex < 0 || !cardRefs.current[selectedCardIndex] || !containerRef.current) return;
        
        const selectedCard = cardRefs.current[selectedCardIndex];
        const container = containerRef.current;

        if (!selectedCard || !container) return;

        const cardRect = selectedCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (cardRect.left < containerRect.left || cardRect.right > containerRect.right) {
            const cardCenter = selectedCard.offsetLeft + selectedCard.offsetWidth / 2;
            const containerCenter = container.offsetWidth / 2;
            const scrollPosition = cardCenter - containerCenter;

            container.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: "smooth"
            });
        }
    }, [selectedCardIndex, containerRef, cardRefs]);
}

