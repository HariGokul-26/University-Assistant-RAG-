import { useEffect, useState } from "react";
import SidebarLogo from "./SidebarLogo";
import SidebarMenu from "./SidebarMenu";
import SidebarRecent from "./SidebarRecent";
import SidebarKnowledgeBase from "./SidebarKnowledgeBase";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  const [activePanel, setActivePanel] = useState("recent");
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const showKnowledgeBase = () => setActivePanel("knowledge-base");
    const showRecentHistory = () => setActivePanel("recent");
    const addRecentChat = (event) => {
      const question = event.detail?.trim();

      if (!question) return;

      setRecentChats((currentChats) => [
        { id: `${Date.now()}-${question}`, question },
        ...currentChats.filter((chat) => chat.question !== question),
      ].slice(0, 10));
    };

    window.addEventListener("show-knowledge-base", showKnowledgeBase);
    window.addEventListener("show-recent-history", showRecentHistory);
    window.addEventListener("new-chat", showRecentHistory);
    window.addEventListener("chat-question-sent", addRecentChat);

    return () => {
      window.removeEventListener("show-knowledge-base", showKnowledgeBase);
      window.removeEventListener("show-recent-history", showRecentHistory);
      window.removeEventListener("new-chat", showRecentHistory);
      window.removeEventListener("chat-question-sent", addRecentChat);
    };
  }, []);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen">

      <SidebarLogo />

      <SidebarMenu />

      {activePanel === "knowledge-base" ? (
        <SidebarKnowledgeBase />
      ) : (
        <SidebarRecent chats={recentChats} />
      )}

      <SidebarFooter />

    </aside>
  );
}

export default Sidebar;
