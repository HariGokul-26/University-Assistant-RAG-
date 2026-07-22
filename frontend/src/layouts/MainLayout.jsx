import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/layout/Header";
import ChatWindow from "../components/chat/ChatWindow";

function MainLayout() {

    return (

        <div className="flex h-screen bg-gray-100">

            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">

                <Header />

                <ChatWindow />

            </div>

        </div>

    );

}

export default MainLayout;