import { FileText } from "lucide-react";

function SourceCard({ source }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <FileText
          size={18}
          className="text-blue-600"
        />

        <span className="font-medium">
          {source.document}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Page {source.page}
      </div>

      <div className="mt-1 text-sm text-green-600">
        Similarity:{" "}
        {(source.similarity_score * 100).toFixed(1)}%
      </div>
    </div>
  );
}

export default SourceCard;
