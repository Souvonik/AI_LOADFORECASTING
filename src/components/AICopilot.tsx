import React, { useState } from 'react';
import { Button } from './ui/button';
import { MessageSquare, X } from 'lucide-react';

const AICopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = { user: message, bot: `You asked: "${message}"` };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold">AI Copilot</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {chatHistory.map((chat, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm font-semibold">You:</p>
                <p className="text-sm mb-2">{chat.user}</p>
                <p className="text-sm font-semibold">AI:</p>
                <p className="text-sm text-blue-500">{chat.bot}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t dark:border-gray-700 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      ) : (
        <Button size="lg" onClick={() => setIsOpen(true)}>
          <MessageSquare className="h-6 w-6 mr-2" />
          AI Copilot
        </Button>
      )}
    </div>
  );
};

export default AICopilot;