import { Settings } from "lucide-react";

function SidebarFooter() {
  return (
    <div className="border-t border-gray-200 p-4">

      <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100 transition">
        <Settings size={20} />
        Settings
      </button>

    </div>
  );
}

export default SidebarFooter;