"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/Icons/Logo";
import React, { useRef, useState } from "react";

export default function LandingPage() {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      console.log("Uploaded file:", file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileChange(event); // Handle the dropped file
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-white">
        <div className="flex items-center space-x-4">
          <Logo height={48} width={48} className="container bg-center flex" />
          <nav className="hidden md:flex space-x-4">
            {["Features", "Use Cases", "Pricing", "Blog"].map((item) => (
              <Link href="#" key={item} className="text-sm font-medium">
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium">Log in</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
            Sign up
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <section className="relative px-6 py-20 mx-auto my-10 max-w-screen-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-6">
              <Image
                src="/images/Image Studio Main Image.jpg"
                alt="Remove Image Background"
                width={813}
                height={542}
                className="rounded-2xl"
              />
            </div>
            <div className="md:w-1/2 mb-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Remove Image Background
              </h1>
              <p className="text-xl mb-8">
                100% automatically - in 5 seconds - without a single click
              </p>
              <div
                className={`bg-white p-6 rounded-lg shadow-lg border-2 ${isDragging ? "border-blue-500" : "border-gray-300"} border-dashed`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="rounded-lg p-6 text-center">
                  <p className="mb-4">Drop an image here</p>
                  <p className="text-sm text-gray-500">or</p>
                  <button
                    onClick={handleImageUpload}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                    aria-label="Upload Image"
                  >
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                {/* Preview Section */}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-center">Preview:</p>
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      width={300}
                      height={300}
                      className="rounded-md mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Add other footer sections here */}
          </div>
        </div>
      </footer>
    </div>
  );
}
