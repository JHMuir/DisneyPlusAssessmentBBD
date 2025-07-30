import type { APIResponse } from "../types/types.ts"
import { useState, useEffect} from 'react'

const API_URL = "https://cd-static.bamgrid.com/dp-7068675309/home.json"

export function getAPIData() {
    const [apiData, setAPIData] = useState<APIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async() => {
            try {
                const apiFetch = await fetch(API_URL, {signal: abortController.signal});
                if (!apiFetch.ok) {
                    throw new Error(`Fetch Error: ${apiFetch.status}`);
                }
                const apiJson: APIResponse = await apiFetch.json();
                
                if(!apiJson.data){
                    throw new Error(`APIResponse Structure Error`);
                }
                // only here to view the loading state placeholder cards 
                setTimeout(() => {
                    if(!abortController.signal.aborted) {
                      setAPIData(apiJson);
                      console.log("Sending Data....");
                      setLoading(false);
                    }
                }, 5000);
            } catch(error) {
                if (!abortController.signal.aborted) {
                    setError(error instanceof Error ? error.message : "Error occurred");
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => {abortController.abort();};
    }, []);
    return {apiData, loading, error};
}