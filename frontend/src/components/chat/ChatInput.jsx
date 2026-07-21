import { useRef, useState } from "react";
import { LoaderCircle, Paperclip, Send } from "lucide-react";
import { uploadDocuments } from "../../services/api";

function ChatInput({ onSend, loading }) {
  const [question, setQuestion] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // ------------------------------------------
  // Send Message
  // ------------------------------------------

  const handleSend = () => {

    if (!question.trim()) return;

    onSend(question);

    setQuestion("");
  };

  // ------------------------------------------
  // Handle Enter Key
  // ------------------------------------------

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }

  };

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

  return (

    <div className="border-t border-gray-200 bg-white px-6 py-4">

      <div className="max-w-4xl mx-auto">

        <div className="flex items-end gap-3 border border-gray-300 rounded-2xl px-4 py-3 shadow-sm">

          <textarea
            rows={1}
            value={question}
            placeholder="Ask anything about your university..."
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 resize-none outline-none text-gray-700 placeholder-gray-400 disabled:bg-white"
          />

          {/* Upload Button */}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            title={isUploading ? "Uploading PDF..." : "Upload PDF"}
          >
            <Paperclip
              size={20}
              className="text-gray-600"
            />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />

          {/* Send Button */}

          <button
            onClick={handleSend}
            disabled={loading}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition"
            title="Send"
          >
            <Send
              size={18}
              className="text-white"
            />
          </button>

        </div>

        {uploadError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {uploadError}
          </p>
        )}

        {isUploading && (
          <div
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
            role="status"
          >
            <LoaderCircle size={16} className="animate-spin" />
            Uploading and indexing your document...
          </div>
        )}

      </div>

    </div>

  );

}

export default ChatInput;
