"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchAPI } from "@/utils/api";

interface FolderSelectionModalProps {
  isOpen: boolean;
  onSelectFolder: (path: string) => void;
  onClose: () => void;
}

type ViewState = "drives" | "folders" | "empty" | "error";

const FolderSelectionModal: React.FC<FolderSelectionModalProps> = ({
  isOpen,
  onSelectFolder,
  onClose,
}) => {
  const [drives, setDrives] = useState<string[]>([]);
  const [folders, setFolders] = useState<Array<{ name: string; path: string }>>(
    []
  );
  const [currentPath, setCurrentPath] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>("drives");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await fetchAPI<{ drives: string[] }>(
          "/media/directories"
        );
        setDrives(response.drives);
        setView("drives");
      } catch (error: unknown) {
        setError(error instanceof Error ? error : new Error(String(error)));
        setView("error");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  const scanDrive = async (drive: string) => {
    try {
      setLoading(true);
      const response = await fetchAPI<{
        directories: Array<{ name: string; path: string }>;
      }>(`/media/directories/${drive}/scan`);
      setFolders(response.directories);
      setCurrentPath(drive);
      setView(response.directories.length ? "folders" : "empty");
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error(String(error)));
      setView("error");
    } finally {
      setLoading(false);
    }
  };

  const scanFolder = async (folder: string, isGoingBack = false) => {
    try {
      setLoading(true);
      const newPath = isGoingBack ? folder : `${currentPath}\\${folder}`;
      const response = await fetchAPI<{
        directories: Array<{ name: string; path: string }>;
      }>(`/media/directories/scan?path=${encodeURIComponent(newPath)}`);
      setFolders(response.directories);
      setCurrentPath(newPath);
      setView(response.directories.length ? "folders" : "empty");
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error(String(error)));
      setView("error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    const parts = currentPath.split(/[/\\]/).filter(Boolean);

    // If we're at a root drive (e.g. "C:"), go back to drives view
    if (parts.length <= 1) {
      setView("drives");
      return;
    }

    // Reconstruct parent path without the last segment
    const parentPath = parts.slice(0, -1).join("\\");
    scanFolder(parentPath, true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
          <DialogTitle className="text-xl text-neutral-900">
            {view === "drives" ? "Select Drive" : "Select Video Folder"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            X
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!loading && view === "drives" && (
            <div className="space-y-2">
              {drives.map((drive) => (
                <button
                  key={drive}
                  className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-neutral-50 text-left h-auto"
                  onClick={() => {
                    setSelectedFolder(drive);
                    scanDrive(drive);
                  }}
                >
                  <span>{drive}</span>
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!loading && view === "folders" && (
            <div className="mb-6">
              <div className="flex flex-col gap-3 mb-4">
                <div className="text-sm text-neutral-600 px-2 flex items-center space-x-2">
                  <span>Current Path:</span>
                  <span>{currentPath}</span>
                </div>
                <div className="divide-y border rounded-lg">
                  <button
                    className="w-full flex items-center p-3 hover:bg-neutral-50 text-left h-auto justify-start"
                    onClick={handleGoBack}
                  >
                    <span>...</span>
                  </button>

                  {folders.map((folder) => (
                    <button
                      key={folder.path}
                      className={`w-full flex items-center p-3 hover:bg-neutral-50 text-left h-auto justify-start ${
                        selectedFolder === folder.path ? "bg-neutral-50" : ""
                      }`}
                      onClick={() => {
                        setSelectedFolder(folder.path);
                        scanFolder(folder.name);
                      }}
                    >
                      <span>{folder.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "empty" && !loading && (
            <div className="text-center py-8">
              <p className="text-neutral-600">
                No folders found in this location
              </p>
              <button
                className="mt-4 text-neutral-600 hover:text-neutral-900"
                onClick={handleGoBack}
              >
                Go Back
              </button>
            </div>
          )}

          {view === "error" && !loading && (
            <div className="text-center py-8">
              <p className="text-neutral-600">
                Unable to access drive contents: {error?.message}
              </p>
              <button
                className="mt-4 text-neutral-600 hover:text-neutral-900"
                onClick={() => setView("drives")}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-neutral-50 rounded-b-xl">
          <div className="flex justify-end space-x-4 w-full">
            <button
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
              onClick={() => onSelectFolder(currentPath)}
              disabled={view === "drives"}
            >
              Select {selectedFolder ? "Folder" : "Drive"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FolderSelectionModal;
