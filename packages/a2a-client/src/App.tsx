import React, { useState, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import ToolCall from './components/ToolCall';
import ToolAuthorization from './components/ToolAuthorization';
import { a2aService } from './services/a2aService';
import { State } from '@a2a-js/sdk';

const App: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isAgentTurn, setIsAgentTurn] = useState(false);

  useEffect(() => {
    a2aService.onMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    a2aService.onStateChange((state: State) => {
      setIsAgentTurn(state === 'RUNNING');
    });
  }, []);

  const handleSendMessage = async (message: string) => {
    setMessages((prevMessages) => [...prevMessages, { type: 'user', content: message }]);
    await a2aService.sendMessage(message);
  };

  const handleAuthorize = async (id: string) => {
    await a2aService.authorizeTool(id);
  };

  const handleDeny = async (id: string) => {
    await a2aService.denyTool(id);
  };

  const renderMessageContent = (message: any) => {
    switch (message.type) {
      case 'tool-call':
        return <ToolCall toolCall={message.content} />;
      case 'tool-auth':
        return (
          <ToolAuthorization
            authRequest={message.content}
            onAuthorize={handleAuthorize}
            onDeny={handleDeny}
          />
        );
      default:
        return message.content;
    }
  };

  const transformedMessages = messages.map((msg) => ({
    ...msg,
    content: renderMessageContent(msg),
  }));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MessageList messages={transformedMessages} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isAgentTurn} />
    </div>
  );
};

export default App;
