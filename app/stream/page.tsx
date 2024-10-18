"use client";

import * as React from "react";

export default function Home() {
  const [data, setData] = React.useState("");

  React.useEffect(() => {
    let ignore = false;
    setData("");

    async function fetchData() {
      const response = await fetch("/api/stream");

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!ignore) {
          setData((prevData) => prevData + chunk);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Streaming Data</h1>
      <pre className="p-4 rounded-lg bg-neutral-900 whitespace-pre-wrap break-words">
        {data || "Loading..."}
      </pre>
    </div>
  );
}
