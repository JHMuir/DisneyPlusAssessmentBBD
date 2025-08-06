import { useMemo } from "react";
import { extractAllSets, getContentText } from "../types/helpers.ts";
import CardRow from "./CardRow";
import { useRowNavigation } from "../hooks/useRowNavigation.ts";
import { useAPIData } from "../hooks/useAPIData.ts";
import '../styles/App.css'
import { ContentFields } from "../types/types.ts";

// Parent Component that controls row navigation, user input, and component mounting 

export function App() {
    const {apiData, loading, error} = useAPIData();

    const setRows = useMemo(() => {
      const sets = extractAllSets(apiData);
      return sets;
    }, [apiData])

    const activeRowIndex = useRowNavigation(setRows);
    const activeRow = setRows[activeRowIndex];

    return (
      <div className="app-container">
        <div className="row-container">
          <CardRow key={activeRow?.setId} title={getContentText(activeRow, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE)} items={activeRow?.items} loading={loading} error={error} />
        </div>
      </div>
    )
  }

export default App;
  