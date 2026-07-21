import { useState } from "react";
import SourceCard from "./SourceCard";

function MessageBubble({ message }) {
  const isUser = message.sender === "user";
  const [showSources, setShowSources] = useState(false);
  const hasSources = !isUser && message.sources?.length > 0;

  return (
    <div className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white border border-gray-200 text-gray-800"
        }`}
      >
        <div className="font-semibold mb-2">
          {isUser ? "You" : "University Assistant"}
        </div>

        <p className="whitespace-pre-wrap leading-7">{message.text}</p>

        {hasSources && (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowSources((isVisible) => !isVisible)}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
            >
              {showSources ? "Hide source details" : "Show source details"}
            </button>

            {showSources && (
              <div className="mt-3 space-y-2">
                <h4 className="font-semibold">Sources & similarity</h4>
                {message.sources.map((source, index) => (
                  <SourceCard key={index} source={source} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
