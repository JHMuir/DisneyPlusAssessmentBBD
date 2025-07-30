import {useEffect, type RefObject} from 'react';

export function horizontalScroll(selectedIndex: number, containerRef: RefObject<HTMLDivElement | null>, cardRefs: RefObject<(HTMLDivElement | null)[]>){
    useEffect(() => {
        if (selectedIndex < 0 || !cardRefs.current[selectedIndex] || !containerRef.current) return;
        
        const selectedCard = cardRefs.current[selectedIndex];
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
    }, [selectedIndex, containerRef, cardRefs]);
}

