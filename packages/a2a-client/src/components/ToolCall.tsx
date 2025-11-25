import React, { useState } from 'react';

interface ToolCallProps {
  toolCall: {
    name: string;
    params: any;
  };
}

const ToolCall: React.FC<ToolCallProps> = ({ toolCall }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-2 p-2 bg-gray-200 rounded-lg">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left font-semibold">
        {isOpen ? '▼' : '►'} Calling Tool: {toolCall.name}
      </button>
      {isOpen && (
        <pre className="mt-2 p-2 bg-gray-800 text-white rounded-lg">
          {JSON.stringify(toolCall.params, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ToolCall;
