import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Layout/Header";
import ChatWindow from "../components/Chat/ChatWindow";

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