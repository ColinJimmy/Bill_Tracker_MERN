import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const UploadForm = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const uploadFile = async (file) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('bill', file);

      const response = await axios.post('/api/expenses/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Bill processed successfully!');
      onUploadSuccess(response.data);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to process bill');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Bill or Receipt</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader className="animate-spin mb-4" size={48} />
            <p className="text-lg">Processing your bill...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {preview ? (
              <div className="mb-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-xs max-h-48 object-contain rounded"
                />
              </div>
            ) : (
              <Upload className="mb-4 text-gray-400" size={48} />
            )}
            
            <p className="text-lg mb-2">
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop a bill here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, PDF (max 5MB)
            </p>
          </div>
        )}
      </div>

      {preview && !uploading && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setPreview(null)}
            className="text-red-500 hover:text-red-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
