import { useMemo, useRef } from "react";
import { getData } from "../api/api.ts";
import { extractAllContentItems, isSeriesContent, isCollectionContent, isMovieContent } from "../types/helpers.ts";
import CardRow from "./CardRow";
import CardOverlay from "./CardOverlay";
import { keyboardNavigation } from "../hooks/keyboardNavigation.ts";

import '../styles/App.css'
import { verticalScroll } from "../hooks/verticalScroll.ts";

// Parent Component that controls row navigation, user input, and component mounting 

export function App() {
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rowContainerRef = useRef<HTMLDivElement>(null);

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

    verticalScroll(activeRowIndex, rowRefs, rowContainerRef);

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
          <div className={`row-container ${showOverlay ? 'blurred' : ''}`} ref={rowContainerRef}>
            {/* <CardRow key={activeRow.title} title={activeRow.title} items={activeRow.items} loading={activeRow.loading} error={activeRow.error} selectedIndex={selectedCardIndex}/> */}
            {contentRows.map((row, rowIndex) => {          
              return (
                <div key={row.title} ref={el => {rowRefs.current[rowIndex] = el;}}>
                  <CardRow title={row.title} items={row.items} loading={row.loading} error={row.error} selectedIndex={rowIndex === activeRowIndex ? selectedCardIndex : -1}/>
                </div>
              );
            })}
          </div>
          {showOverlay && activeRow.items[selectedCardIndex] && (
              <CardOverlay item={activeRow.items[selectedCardIndex]} />
          )}
        </div>
    )
  }

export default App;
  