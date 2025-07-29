import type { APIResponse } from "../types/types.ts"
import { useState, useEffect} from 'react'

const API_URL = "https://cd-static.bamgrid.com/dp-7068675309/home.json"

// Functions and hooks that fetch and interface with the API endpoint

export async function fetchAPIData(): Promise<APIResponse> {
    try {
        const apiFetch = await fetch(API_URL);

        if (!apiFetch.ok) {
            throw new Error(`Error ${apiFetch.status}`)
        }
        const data: APIResponse = await apiFetch.json();

        if (!data.data) {
            throw new Error("Invalid APIResponse structure");
        }

        return data;

    } catch(error) {
        console.error(`Error fetching API Data: ${error}`)
        throw error;
    }
}

export function getData() {
    const [data, setData] = useState<APIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await fetchAPIData();
          // only here to view the loading state placeholder cards 
          setTimeout(() => {
            setData(result);
            console.log("Sending Data....");
            setLoading(false);
          }, 5000);
        } catch(error) {
          setError(error instanceof Error ? error.message : "Error occurred");
          setLoading(false);
        }
      };
      fetchData();
    }, []);
    return { data, loading, error };
  }