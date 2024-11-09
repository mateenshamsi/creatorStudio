'use client';

import { FormEvent, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { CldImage, CldUploadWidget } from 'next-cloudinary';

// Add this at the top of your file
declare global {
  var cloudinary: any;
}

export default function ImageUploader() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState("");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Add this check at the start of your component
  if (!cloudName) {
    console.error('No cloudinary name found');
    return (
      <div className="text-red-500">
        Please configure your Cloudinary cloud name in environment variables.
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setError(null);
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);
      }
    }
  };

  const onSumbitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(!imageFile) {
        setError("Please select an image");
        return;
      }
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post('/api/upload-image', formData);
      const data = await res.data;
      console.log("Upload response:", data);
      
      if(data && data.public_id) {
        setUploadedImageId(data.public_id);
      } else {
        setError("Failed to get image ID from upload");
      }
    } catch(err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <form onSubmit={onSumbitHandler} className="flex flex-col gap-4">
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*"
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
            file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <Button 
          type="submit" 
          disabled={loading || !imageFile}
          className="w-full"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Preview */}
        {imageUrl && (
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Original Preview:</h3>
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Cloudinary Image with Background Removal */}
        {uploadedImageId && (
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Processed Image:</h3>
            <CldImage
              width="400"
              height="400"
              src={uploadedImageId}
              sizes="100vw"
              alt="Uploaded image"
              removeBackground
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}