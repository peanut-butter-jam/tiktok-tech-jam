import React from "react";

interface SubmitButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function SubmitButton({ disabled, onClick, children }: SubmitButtonProps) {
  return (
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
    >
      {children || "Upload"}
    </button>
  );
}