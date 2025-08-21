interface HeaderProps {
    username: string;
    setUsername: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ username, setUsername }) => {
    return (
        <header className="bg-white shadow- text-black p-4 sticky top-0 z-10">
            <div className="container mx-auto max-w-4xl flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Sohbet Odası</h1>
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Kullanıcı Adınız..."
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  transition"
                    />
                </div>
            </div>
        </header>
    );
};

