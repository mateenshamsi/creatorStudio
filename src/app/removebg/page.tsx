'use client'

import React, { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs';
import { FileUpload } from '@/components/ui/file-upload'
import dynamic from 'next/dynamic'

const TensorFlow = dynamic(
  () => import('@tensorflow/tfjs').then((tf) => ({ default: tf })),
  { ssr: false }
)

const predefinedColors = {
  "Red": [255, 0, 0],
  "Green": [0, 255, 0],
  "Blue": [0, 0, 255],
  "White": [255, 255, 255],
  "Black": [0, 0, 0]
}

function RemoveBg() {
  const [file, setFile] = useState<File | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null)
  const [newBgImage, setNewBgImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [colorChoice, setColorChoice] = useState<string>("White")
  const [customColor, setCustomColor] = useState<string>("#FFFFFF")
  const [model, setModel] = useState<any | null>(null)

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tf.loadGraphModel('https://www.kaggle.com/models/vaishaknair456/u2-net-portrait-background-remover/tensorFlow2/40_saved_model/1')
        setModel(loadedModel)
      } catch (error) {
        console.error('Failed to load the model:', error)
        setError('Failed to load the background removal model. Please try again later.')
      }
    }
    loadModel()
  }, [])

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile)
      setOriginalImage(URL.createObjectURL(selectedFile))
      setRemovedBgImage(null)
      setNewBgImage(null)
      setError(null)
    }
  }

  const handleRemoveBackground = async () => {
    if (!file || !model) {
      setError('Please upload an image and wait for the model to load.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('colorChoice', colorChoice)
      formData.append('customColor', customColor)

      const response = await fetch('/removebg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()

      // Process the image on the client-side using TensorFlow.js
      const img = new Image()
      img.src = data.originalImage
      await new Promise((resolve) => { img.onload = resolve })

      const tensor = tf.browser.fromPixels(img).div(255.0).expandDims(0)
      const output = model.predict(tensor) as tf.Tensor
      const probability = await output.squeeze().array() as number[][]

      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = 512
      maskCanvas.height = 512
      const maskCtx = maskCanvas.getContext('2d')
      if (!maskCtx) throw new Error('Failed to get mask canvas context')

      const maskImageData = maskCtx.createImageData(512, 512)
      for (let i = 0; i < probability.length; i++) {
        for (let j = 0; j < probability[i].length; j++) {
          const index = (i * 512 + j) * 4
          const alpha = probability[i][j] * 255
          maskImageData.data[index + 3] = alpha
        }
      }
      maskCtx.putImageData(maskImageData, 0, 0)

      ctx.globalCompositeOperation = 'destination-in'
      ctx.drawImage(maskCanvas, 0, 0)

      setRemovedBgImage(canvas.toDataURL())

      // Apply new background color
      const bgColor = colorChoice === 'Custom' 
        ? [parseInt(customColor.slice(1, 3), 16), parseInt(customColor.slice(3, 5), 16), parseInt(customColor.slice(5, 7), 16)]
        : predefinedColors[colorChoice as keyof typeof predefinedColors]

      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`
      ctx.fillRect(0, 0, 512, 512)

      setRemovedBgImage(removedBgCanvas.toDataURL())
      setNewBgImage(newBgCanvas.toDataURL())
    } catch (err) {
      console.error('Error processing image:', err)
      setError('An error occurred while processing the image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center mt-20 space-y-8'>
      <h1 className='text-3xl font-bold'>Remove Image Background</h1>
      <FileUpload onFileSelect={handleFileChange} />
      
      {file && (
        <>
          <div className='text-center'>
            <p>Selected file: {file.name}</p>
          </div>
          
          <div>
            <label htmlFor="colorChoice" className="block mb-2">Choose background color:</label>
            <select
              id="colorChoice"
              value={colorChoice}
              onChange={(e) => setColorChoice(e.target.value)}
              className="block w-full p-2 border rounded"
            >
              {Object.keys(predefinedColors).map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
              <option value="Custom">Custom</option>
            </select>
          </div>

          {colorChoice === "Custom" && (
            <div>
              <label htmlFor="customColor" className="block mb-2">Pick a custom color:</label>
              <input
                type="color"
                id="customColor"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="block w-full p-1 border rounded"
              />
            </div>
          )}

          <button 
            onClick={handleRemoveBackground} 
            disabled={isLoading || !model}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
          >
            {isLoading ? 'Processing...' : model ? 'Remove Background' : 'Loading model...'}
          </button>
        </>
      )}

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {originalImage && removedBgImage && newBgImage && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
          <div>
            <h2 className='text-xl font-semibold mb-4'>Original Image:</h2>
            <img src={originalImage} alt="Original" className='max-w-full rounded-lg shadow-lg' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-4'>Removed Background:</h2>
            <img src={removedBgImage} alt="Removed Background" className='max-w-full rounded-lg shadow-lg' />
            <a 
              href={removedBgImage} 
              download="removed_bg.png"
              className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block'
            >
              Download
            </a>
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-4'>New Background:</h2>
            <img src={newBgImage} alt="New Background" className='max-w-full rounded-lg shadow-lg' />
            <a 
              href={newBgImage} 
              download="new_bg.png"
              className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block'
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default RemoveBg