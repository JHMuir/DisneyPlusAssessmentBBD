import { useMemo } from "react";
import { extractAllContentItems, isSeriesContent, isCollectionContent, isMovieContent } from "../types/helpers.ts";
import CardRow from "./CardRow";
import { useRowNavigation } from "../hooks/useRowNavigation.ts";
import { useAPIData } from "../hooks/useAPIData.ts";
import '../styles/App.css'

// Parent Component that controls row navigation, user input, and component mounting 

export function App() {
    const {apiData, loading, error} = useAPIData();
    
    // Memoizing our row data to prevent repeated expensive calculations 
    const contentRows = useMemo(() => {
      const allItems = extractAllContentItems(apiData);
      return [
        {title: "Collections", items: allItems.filter(isCollectionContent)},
        {title: "Movies", items: allItems.filter(isMovieContent)},
        {title: "Series", items: allItems.filter(isSeriesContent)}
      ]
    }, [apiData])

    const activeRowIndex = useRowNavigation(contentRows);
    const activeRow = contentRows[activeRowIndex];

    return (
      <div className="app-container">
        <div className="row-container">
          <CardRow key={activeRow.title} title={activeRow.title} items={activeRow.items} loading={loading} error={error} />
        </div>
      </div>
    )
  }

export default App;
  