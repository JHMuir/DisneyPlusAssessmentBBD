import { useMemo } from "react";
import { getData } from "../api/api.ts";
import { extractAllContentItems, isSeriesContent, isCollectionContent, isMovieContent } from "../types/helpers.ts";
import CardRow from "./CardRow";
import CardOverlay from "./CardOverlay";
import { keyboardNavigation } from "../hooks/keyboardNavigation.ts";

import '../styles/App.css'

// Parent Component that controls row navigation, user input, and component mounting 

export function App() {
    const {data, loading, error} = getData();
    
    // Memoizing our row data to prevent repeated expensive calculations 
    const allItems = extractAllContentItems(data);
    const contentRows = useMemo(() => [
        {title: "Collections", items: allItems.filter(isCollectionContent), loading: loading, error: error},
        {title: "Movies", items: allItems.filter(isMovieContent), loading: loading, error: error},
        {title: "Series", items: allItems.filter(isSeriesContent), loading: loading, error: error}
    ], [allItems]);

    const {activeRowIndex, selectedCardIndex, showOverlay} = keyboardNavigation(contentRows);
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
  