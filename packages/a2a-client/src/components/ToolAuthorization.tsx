import React from 'react';

interface ToolAuthorizationProps {
  authRequest: {
    id: string;
    toolName: string;
    params: any;
  };
  onAuthorize: (id: string) => void;
  onDeny: (id: string) => void;
}

const ToolAuthorization: React.FC<ToolAuthorizationProps> = ({ authRequest, onAuthorize, onDeny }) => {
  return (
    <div className="my-2 p-4 bg-yellow-200 rounded-lg">
      <div className="font-semibold">
        The agent wants to use the tool: {authRequest.toolName}
      </div>
      <pre className="mt-2 p-2 bg-gray-800 text-white rounded-lg">
        {JSON.stringify(authRequest.params, null, 2)}
      </pre>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onDeny(authRequest.id)}
          className="mr-2 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Deny
        </button>
        <button
          onClick={() => onAuthorize(authRequest.id)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Authorize
        </button>
      </div>
    </div>
  );
};

export default ToolAuthorization;
