import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";

function MessageList({ messages, loading }) {

    const bottomRef = useRef(null);

    // --------------------------------------
    // Auto Scroll
    // --------------------------------------

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, loading]);

    return (

        <div className="h-full overflow-y-auto modern-scrollbar px-6 py-6">

            <div className="max-w-4xl mx-auto">

                {

                    messages.map((message, index) => (

                        <MessageBubble
                            key={index}
                            message={message}
                        />

                    ))

                }

                {

                    loading && (

                        <div className="flex justify-start mb-6">

                            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">

                                <div className="font-semibold mb-2">
                                    University Assistant
                                </div>

                                <p className="text-gray-500 italic">
                                    Thinking...
                                </p>

                            </div>

                        </div>

                    )

                }

                <div ref={bottomRef} />

            </div>

        </div>

    );

}

export default MessageList;
