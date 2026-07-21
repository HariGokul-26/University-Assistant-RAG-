import {
  MessageSquarePlus,
  BookOpen,
  History,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { uploadDocuments } from "../../services/api";

function SidebarMenu() {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFilesSelected = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setIsUploading(true);
    setUploadError("");

    try {
      await uploadDocuments(files);
      window.dispatchEvent(new Event("documents-updated"));
    } catch (error) {
      console.error("Document upload failed:", error);
      setUploadError("Couldn't upload the selected document.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const startNewChat = () => {
    window.dispatchEvent(new Event("new-chat"));
  };

  const showRecentHistory = () => {
    window.dispatchEvent(new Event("show-recent-history"));
  };

  return (
    <div className="p-4 space-y-2">

      <button
        type="button"
        onClick={startNewChat}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
      >
        <MessageSquarePlus size={20} />
        New Chat
      </button>

      <button
        type="button"
        onClick={showRecentHistory}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-blue-600 hover:bg-blue-50 transition"
      >
        <History size={20} />
        Recent History
      </button>

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("show-knowledge-base"))}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-blue-600 hover:bg-blue-50 transition"
      >
        <BookOpen size={20} />
        Knowledge Base
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 transition"
      >
        <Upload size={20} />
        {isUploading ? "Uploading..." : "Upload Documents"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />

      {uploadError && (
        <p className="px-1 text-xs text-red-600" role="alert">
          {uploadError}
        </p>
      )}

    </div>
  );
}

export default SidebarMenu;
