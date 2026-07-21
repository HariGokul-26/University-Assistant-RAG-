import { useCallback, useEffect, useState } from "react";
import { BookOpen, FileText, LoaderCircle, Trash2 } from "lucide-react";
import { deleteDocument, getDocuments } from "../../services/api";

function SidebarKnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingDocument, setDeletingDocument] = useState("");

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getDocuments();
      setDocuments(response.documents || []);
    } catch (requestError) {
      console.error("Couldn't load documents:", requestError);
      setError("Couldn't load documents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const loadInitialDocuments = async () => {
      try {
        const response = await getDocuments();

        if (isCurrent) {
          setDocuments(response.documents || []);
          setError("");
        }
      } catch (requestError) {
        console.error("Couldn't load documents:", requestError);

        if (isCurrent) {
          setError("Couldn't load documents.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    loadInitialDocuments();
    window.addEventListener("documents-updated", loadDocuments);

    return () => {
      isCurrent = false;
      window.removeEventListener("documents-updated", loadDocuments);
    };
  }, [loadDocuments]);

  const handleDelete = async (documentName) => {
    setDeletingDocument(documentName);
    setError("");

    try {
      await deleteDocument(documentName);
      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document !== documentName)
      );
    } catch (requestError) {
      console.error("Couldn't delete document:", requestError);
      setError("Couldn't delete the document.");
    } finally {
      setDeletingDocument("");
    }
  };

  return (
    <div className="flex-1 px-4 py-2 overflow-y-auto modern-scrollbar">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-blue-600" />
        <h2 className="text-sm font-semibold !text-blue-600 uppercase tracking-wide">
          Knowledge Base
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
          <LoaderCircle size={16} className="animate-spin" />
          Loading documents...
        </div>
      ) : error ? (
        <p className="px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : documents.length === 0 ? (
        <p className="px-3 py-2 text-sm text-gray-500">
          No documents uploaded yet.
        </p>
      ) : (
        <div className="space-y-1">
          {documents.map((document) => (
            <div
              key={document}
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText size={16} className="shrink-0 text-blue-600" />
              <span className="min-w-0 flex-1 truncate" title={document}>
                {document}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(document)}
                disabled={deletingDocument === document}
                aria-label={`Delete ${document}`}
                className="rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed group-hover:opacity-100 focus:opacity-100 transition"
              >
                {deletingDocument === document ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SidebarKnowledgeBase;
