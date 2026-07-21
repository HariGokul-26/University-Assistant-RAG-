import { GraduationCap, Search } from "lucide-react";

function SidebarLogo() {
  return (
    <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between">
      <div className="bg-blue-600 p-2 rounded-xl">
        <GraduationCap className="w-6 h-6 text-white" />
      </div>

      <button
        type="button"
        aria-label="Search chats"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
      >
        <Search size={20} />
      </button>
    </div>
  );
}

export default SidebarLogo;
