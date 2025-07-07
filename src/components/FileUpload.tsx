import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Music, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File;
  className?: string;
}

const FileUpload = ({ onFileSelect, selectedFile, className = '' }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.aac']
    },
    maxFiles: 1
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset file selection by calling onFileSelect with null
    // onFileSelect(null);
  };

  return (
    <div className={className}>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-600 hover:border-green-500/50 hover:bg-gray-800/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-black" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white mb-2">
                {isDragActive ? 'Drop your audio file here' : 'Upload Your Audio File'}
              </p>
              <p className="text-gray-400 text-sm">
                Drag & drop or click to select • MP3, WAV, FLAC, AAC
              </p>
            </div>
            <Button
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/20"
            >
              Choose File
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-green-500/20 rounded-lg p-4 bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;