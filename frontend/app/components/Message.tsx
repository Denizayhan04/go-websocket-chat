import { IMessage } from "../types/types";


const MessageBubbleIcon: React.FC = () => (
  <svg className="absolute bottom-0 w-4 h-4 text-inherit" viewBox="0 0 16 16">
    <path fill="currentColor" d="M0 16V0h16L0 16z" />
  </svg>
);

// Mesaj bileşeninin alacağı propların tip tanımı
interface MessageProps {
  msg: IMessage
  currentUser: string;
}

export const Message: React.FC<MessageProps> = ({ msg, currentUser }) => {
  const isCurrentUser = msg.sender === currentUser;

  const messageClasses = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isCurrentUser
    ? 'bg-blue-600 text-white rounded-br-none'
    : 'bg-gray-200 text-gray-800 rounded-bl-none';
  const iconClasses = isCurrentUser ? 'right-[-1px] transform scale-x-[-1]' : 'left-[-1px]';

  return (
    <div className={`flex items-end w-full ${messageClasses}`}>
      <div className={`relative max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-md ${bubbleClasses}`}>
        {!isCurrentUser && (
          <p className="text-xs font-bold text-gray-600 mb-1">{msg.sender}</p>
        )}
        <p className="text-sm break-words">{msg.text}</p>
        <div className={`absolute bottom-0 w-4 h-4 ${iconClasses}`}>
          <MessageBubbleIcon />
        </div>
      </div>
    </div>
  );
};


