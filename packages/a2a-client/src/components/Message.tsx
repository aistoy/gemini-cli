import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageProps {
  message: {
    type: 'user' | 'agent' | 'system';
    content: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { type, content } = message;

  const getMessageStyle = () => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 self-end';
      case 'agent':
        return 'bg-gray-100 self-start';
      case 'system':
        return 'bg-yellow-100 self-center text-xs';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`p-4 my-2 rounded-lg max-w-2xl ${getMessageStyle()}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={dark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Message;
