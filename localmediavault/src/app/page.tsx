"use client";

import FolderSelection from "@/components/FolderSelection";
import { useState } from "react";
import { fetchAPI } from "@/utils/api";

interface MediaItem {
  name: string;
  type: "file" | "directory";
  path: string;
}

export default function Home() {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFolderSelect = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchAPI<{ items: MediaItem[] }>("/media/scan", {
        method: "POST",
        body: JSON.stringify({ folderPath: currentPath }),
      });

      const sortedItems = [...response.items].sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      setItems(sortedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan directory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FolderSelection
      setCurrentPath={setCurrentPath}
      handleFolderSelect={handleFolderSelect}
    />
  );
}
