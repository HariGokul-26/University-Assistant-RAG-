import { History } from "lucide-react";

function SidebarRecent({ chats }) {
  return (
    <div className="flex-1 px-4 py-2 overflow-y-auto modern-scrollbar">
      <div className="flex items-center gap-2 mb-4">
        <History size={18} className="text-blue-600" />
        <h2 className="text-sm font-semibold !text-blue-600 uppercase tracking-wide">
          Recent History
        </h2>
      </div>

      {chats.length === 0 ? (
        <p className="px-3 py-2 text-sm text-gray-500">
          Your recent questions will appear here.
        </p>
      ) : (
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className="w-full truncate rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
              title={chat.question}
            >
              {chat.question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SidebarRecent;
