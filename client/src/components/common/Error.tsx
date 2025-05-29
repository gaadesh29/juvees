import React from 'react';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
      <p className="text-center">{message}</p>
    </div>
  );
};

export default Error; 