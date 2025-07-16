import { useState, useEffect, useMemo } from "react";
import { getData } from "../api/api.ts";
import { extractAllContentItems, isSeriesContent, isCollectionContent, isMovieContent } from "../types/helpers.ts";
import CardRow from "./CardRow";
import CardOverlay from "./CardOverlay";
import '../styles/App.css'

// Parent Component that controls row navigation, user input, and component mounting 

export function App() {
    const {data, loading, error} = getData();
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    
    // Memoizing our row data to prevent repeated expensive calculations 
    const allItems = extractAllContentItems(data);
    const contentRows = useMemo(() => [
        {title: "Collections", items: allItems.filter(isCollectionContent), loading: loading, error: error},
        {title: "Movies", items: allItems.filter(isMovieContent), loading: loading, error: error},
        {title: "Series", items: allItems.filter(isSeriesContent), loading: loading, error: error}
    ], [allItems]);
    
    // React Hook that handles row navigation and user input
    useEffect(() => {
      let isProcessing = false; // Only here to prevent React from firing this hook twice due to React's StrictMode
  
      const handleKeyDown  = (event: KeyboardEvent) => {
        if (isProcessing) return;

        // At a high level, we navigate both which row and within a row simply by indexing its respective array
        const activeRow = contentRows[activeRowIndex];
        const maxCards = activeRow ? activeRow.items.length - 1 : 0;
        // Row-to-Row navigation
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
        // Current card navigation within a row
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
        // Handling the visibility of the overlay
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

    // Fallback statement in case a row is empty
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
  