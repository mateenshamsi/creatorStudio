'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SoundStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, send to our Next.js API route
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/audiodenoise', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      // Handle the denoised audio file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = url;
      a.download = `denoised_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Audio Denoising Studio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="audio-file" className="text-sm font-medium">
                Select Audio File
              </label>
              <input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="border rounded p-2"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Denoise Audio'}
            </Button>

            {file && (
              <div className="text-sm text-gray-600">
                Selected file: {file.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}