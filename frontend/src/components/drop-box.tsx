import React, { useState, useRef } from "react";

interface DropBoxProps {
  onFileUpload?: (files: FileList) => void;
  acceptedFileTypes?: string;
  multiple?: boolean;
  maxFileSize?: number; // in MB
}

const DropBox: React.FC<DropBoxProps> = ({
  onFileUpload,
  acceptedFileTypes = "*",
  multiple = true,
  maxFileSize = 10,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(
          `File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`
        );
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) =>
        multiple ? [...prev, ...validFiles] : validFiles
      );

      // Create a FileList-like object
      const fileList = {
        ...validFiles,
        length: validFiles.length,
        item: (index: number) => validFiles[index] || null,
      } as FileList;

      onFileUpload?.(fileList);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-gray-400"
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={acceptedFileTypes}
          multiple={multiple}
          className="hidden"
        />

        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {acceptedFileTypes === "*" ? "Any file type" : acceptedFileTypes}{" "}
              (max {maxFileSize}MB)
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-2 text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { DropBox };