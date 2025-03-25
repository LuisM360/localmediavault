"use client";

import { useState } from "react";
import FolderSelectionModal from "./FolderSelectionModal";
import {
  Film,
  FolderOpen,
  FolderPlus,
  Zap,
  Lock,
  Wand2,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface FolderSelectionProps {
  setCurrentPath: Dispatch<SetStateAction<string>>;
  handleFolderSelect: () => Promise<void>;
}

const FolderSelection: React.FC<FolderSelectionProps> = ({
  setCurrentPath,
  handleFolderSelect,
}) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isSelectFolderModalOpen, setIsSelectFolderModalOpen] = useState(false);

  const handleSelectFolder = () => {
    setIsSelectFolderModalOpen(true);
  };
  const handleSelectFolder2 = (path: string) => {
    setCurrentPath(path);
    setIsSelectFolderModalOpen(false);
    handleFolderSelect();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Film className="text-blue-600" size={24} />
            <span className="text-xl font-semibold text-gray-800">
              LocalMediaVault
            </span>
          </div>
          <nav className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 flex items-center"
              aria-label="Help"
              tabIndex={0}
            >
              <HelpCircle size={18} />
              <span className="ml-1">Help</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="mb-8">Fake Image</div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to LocalMediaVault
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Your personal video library manager. Select your video folder to
              start organizing and accessing your collection with ease. No
              complicated setup, just direct access to your media.
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <FolderOpen className="text-blue-600" size={48} />
              </div>

              <p className="text-gray-600 mb-6">
                To get started, please select the folder containing your video
                library. This will allow you to browse and play your videos
                within LocalMediaVault.
              </p>

              <button
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-white font-medium shadow-lg shadow-blue-100"
                onClick={() => setIsSelectFolderModalOpen(true)}
                aria-label="Select Video Folder"
                tabIndex={0}
              >
                <FolderPlus className="mr-2" size={20} />
                Select Video Folder
              </button>
              <FolderSelectionModal
                isOpen={isSelectFolderModalOpen}
                onClose={() => setIsSelectFolderModalOpen(false)}
                onSelectFolder={handleSelectFolder2}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Zap className="text-yellow-500 mb-4" size={24} />
                <h3 className="text-lg font-semibold mb-2">Simple & Fast</h3>
                <p className="text-gray-600">
                  Direct access to your videos without unnecessary complexity
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Lock className="text-green-500 mb-4" size={24} />
                <h3 className="text-lg font-semibold mb-2">Local Storage</h3>
                <p className="text-gray-600">
                  Your files stay on your device, ensuring privacy
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Wand2 className="text-purple-500 mb-4" size={24} />
                <h3 className="text-lg font-semibold mb-2">Clean Interface</h3>
                <p className="text-gray-600">
                  Intuitive design focused on your content
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 LocalMediaVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FolderSelection;
