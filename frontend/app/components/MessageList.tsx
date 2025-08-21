
import { IMessage } from "../types/types";
import { Message } from "./Message";

interface MessageListProps {
    messages: IMessage[];
    currentUser: string;
    chatEndRef: React.Ref<HTMLDivElement> 
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, chatEndRef }) => {
    return (
        <main className="flex-1 overflow-y-auto p-4">
            <div className="container mx-auto max-w-4xl space-y-4">
                {messages.map((msg) => (
                    <Message key={msg.id} msg={msg} currentUser={currentUser} />
                ))}
                <div ref={chatEndRef} />
            </div>
        </main>
    );
};
