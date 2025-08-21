interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    username: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage, handleSendMessage, username }) => {
    return (
        <footer className="bg-white p-4 sticky bottom-0 z-10 border-t">
            <div className="container mx-auto max-w-4xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className=" text-black flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        disabled={!username}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                        disabled={!username || !newMessage.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </footer>
    );
};
