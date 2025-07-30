import { useEffect, type RefObject } from "react";

export function verticalScroll(activeRowIndex: number, rowRefs: RefObject<(HTMLDivElement | null)[]>, rowContainerRef: RefObject<HTMLDivElement | null>){
    useEffect(() => {
        console.log("AM I HERE????????")
        if (activeRowIndex >= 0 && rowRefs.current[activeRowIndex] && rowContainerRef.current) {
            const activeRow = rowRefs.current[activeRowIndex];
            const rowContainer = rowContainerRef.current;

            if(activeRow && rowContainer){
                const activeRowRect = activeRow.getBoundingClientRect();
                const rowContainerRect = rowContainer.getBoundingClientRect();

                if (activeRowRect.top < rowContainerRect.top || activeRowRect.bottom > rowContainerRect.bottom) {
                    const rowCenter = activeRow.offsetTop + activeRow.offsetHeight / 2;
                    const rowContainerCenter = rowContainer.offsetHeight / 2;
                    const scrollPosition = rowCenter - rowContainerCenter;

                    rowContainer.scrollTo({
                        top: Math.max(0, scrollPosition),
                        behavior: "smooth"
                    });
                }
            }
        }
    }, [activeRowIndex, rowRefs, rowContainerRef]);
}