import { useState, useEffect, useMemo } from "react";
import { getData } from "../api/api";
import { extractAllContentItems, isSeriesContent, isCollectionContent, isMovieContent } from "../types/helpers";
import CardRow from "./CardRow";
import CardOverlay from "./CardOverlay";
import '../styles/App.css'

export function App() {
    const {data, loading, error} = getData();
  
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    
    const allItems = extractAllContentItems(data);
    const contentRows = useMemo(() => [
        {title: "Collections", items: allItems.filter(isCollectionContent), loading: loading, error: error},
        {title: "Movies", items: allItems.filter(isMovieContent), loading: loading, error: error},
        {title: "Series", items: allItems.filter(isSeriesContent), loading: loading, error: error}
    ], [allItems]);
    
    useEffect(() => {
      let isProcessing = false;
  
      const handleKeyDown  = (event: KeyboardEvent) => {
        if (isProcessing) return;

        const activeRow = contentRows[activeRowIndex];
        const maxCards = activeRow ? activeRow.items.length - 1 : 0;
        if (event.key === "ArrowUp" || event.code === "KeyW") {
          event.preventDefault();
          if(!showOverlay) {
            isProcessing = true;
            setActiveRowIndex(prev => Math.max(0, prev - 1));
            setSelectedCardIndex(0);
            setTimeout(() => {isProcessing = false}, 50);
          }
        }
        else if (event.key === "ArrowDown" || event.code === "KeyS") {
          event.preventDefault();
          if(!showOverlay) {
            isProcessing = true;
            setActiveRowIndex(prev => Math.min(contentRows.length - 1, prev + 1));
            setSelectedCardIndex(0);
            setTimeout(() => {isProcessing = false}, 50);
          }
        }
        else if (event.key === "ArrowLeft" || event.code === "KeyA") {
          event.preventDefault();
          if(!showOverlay) {  
            isProcessing = true;
            setSelectedCardIndex(prev => Math.max(0, prev - 1));
            setTimeout(() => {isProcessing = false}, 50);
          }
        }
        else if (event.key === "ArrowRight" || event.code === "KeyD") {
          event.preventDefault();
          if(!showOverlay) {  
            isProcessing = true;
            setSelectedCardIndex(prev => Math.min(maxCards, prev + 1));
            setTimeout(() => {isProcessing = false}, 50);
          }
        }
        else if(event.key === "Enter") {
          if(!showOverlay) {
            event.preventDefault();
            isProcessing = true;
            setShowOverlay(true);
            setTimeout(() => {isProcessing = false}, 50);
          }
        }
        else if(event.key === "Escape") {
          if(showOverlay) {
            event.preventDefault();
            isProcessing = true;
            setShowOverlay(false);
            setTimeout(() => {isProcessing = false}, 50);
          }
        }
      }
  
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [activeRowIndex, allItems, showOverlay])
    
    const activeRow = contentRows[activeRowIndex];
    if(!activeRow || activeRow.items.length === 0) {
        return (
            <div className="app-container">
                <div>{activeRow?.title || "Unknown"}</div>
            </div>
        )
    }
    
    return (
        <div className="app-container">
          <div className={`row-container ${showOverlay ? 'blurred' : ''}`}>
            <CardRow key={activeRow.title} title={activeRow.title} items={activeRow.items} loading={activeRow.loading} error={activeRow.error} selectedIndex={selectedCardIndex}/>
          </div>
          {showOverlay && activeRow.items[selectedCardIndex] && (
              <CardOverlay item={activeRow.items[selectedCardIndex]} />
          )}
        </div>
    )
  }

export default App;
  