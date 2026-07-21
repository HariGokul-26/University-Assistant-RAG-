import { useEffect, useState } from "react";

import MessageList from "./MessageList";
import WelcomeScreen from "./WelcomeScreen";

import ChatInput from "./ChatInput";

import { askQuestion } from "../../services/api";

function ChatWindow() {

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const handleNewChat = () => {
            setMessages([]);
        };

        window.addEventListener("new-chat", handleNewChat);

        return () => window.removeEventListener("new-chat", handleNewChat);

    }, []);

    // ----------------------------------------------------
    // Send Message
    // ----------------------------------------------------

    const handleSendMessage = async (question) => {

        if (!question.trim()) return;

        // User Message
        const userMessage = {
            sender: "user",
            text: question
        };

        setMessages((prev) => [...prev, userMessage]);

        window.dispatchEvent(
            new CustomEvent("chat-question-sent", { detail: question })
        );

        setLoading(true);

        try {

            const response = await askQuestion(question);

            const assistantMessage = {
                sender: "assistant",
                text: response.answer,
                sources: response.sources
            };

            setMessages((prev) => [
                ...prev,
                assistantMessage
            ]);

        }
        catch (error) {

            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "assistant",
                    text: "Something went wrong while contacting the server.",
                    sources: []
                }
            ]);

        }
        finally {

            setLoading(false);

        }

    };

    return (

    <div className="flex flex-col flex-1 min-h-0">

        {/* Conversation Area */}

        <div className="flex-1 min-h-0">

            {

                messages.length === 0

                    ? <WelcomeScreen />

                    : (

                        <MessageList
                            messages={messages}
                            loading={loading}
                        />

                    )

            }

        </div>

        {/* Fixed Chat Input */}

        <ChatInput
            onSend={handleSendMessage}
            loading={loading}
        />

    </div>

);

}

export default ChatWindow;
