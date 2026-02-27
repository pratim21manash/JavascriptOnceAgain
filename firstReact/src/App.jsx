import { Download, Plus, Trash2, Image as ImageIcon, Ruler, FileJson, RefreshCw } from "lucide-react"
import { useState } from "react"

const App = () => {
  const [src, setSrc] = useState(null)
  const [quality, setQuality] = useState(0.5)
  const [format, setFormat] = useState("webp")
  const [originalSize, setOriginalSize] = useState(null)
  const [compressedSize, setCompressedSize] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [showComparison, setShowComparison] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)

  const chooseImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const url = URL.createObjectURL(file)
    setSrc(url)
    setOriginalSize((file.size / 1024).toFixed(2))
    setCompressedSize(null)
    setShowComparison(false)
    
    const img = new Image()
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height })
    }
    img.src = url
  }

  const compressImage = () => {
    setIsCompressing(true)
    const image = new Image()
    image.src = src

    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = image.width
      canvas.height = image.height
      const page = canvas.getContext("2d")
      page.drawImage(image, 0, 0)
      
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`
      const fileExtension = format === "jpg" ? "jpg" : format
      
      canvas.toBlob((blob) => {
        const compressedUrl = URL.createObjectURL(blob)
        setCompressedSize((blob.size / 1024).toFixed(2))
        setShowComparison(true)
        
        const a = document.createElement('a')
        a.href = compressedUrl
        a.download = `compressed-image.${fileExtension}`
        a.click()
        setIsCompressing(false)
      }, mimeType, quality)
    }
  }

  const resetImage = () => {
    setSrc(null)
    setOriginalSize(null)
    setCompressedSize(null)
    setShowComparison(false)
    setDimensions({ width: 0, height: 0 })
    setQuality(0.5)
    setFormat("webp")
  }

  const getSizeReduction = () => {
    if (!originalSize || !compressedSize) return 0
    return ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-11/12 md:w-8/12 lg:w-6/12 mx-auto space-y-8 border border-white/50">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Image Compressor
          </h1>
          <p className="text-gray-500">Compress your images without losing quality</p>
        </div>

        {/* Image Preview Card */}
        {src ? (
          <div className="space-y-4">
            <div className="relative group">
              <img 
                src={src}
                className="w-full rounded-xl h-[400px] object-cover shadow-lg"
                alt="Preview"
              />
              <button
                onClick={resetImage}
                className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 shadow-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Image Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Ruler size={18} />
                  <span className="text-sm font-medium">Dimensions</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {dimensions.width} x {dimensions.height} px
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FileJson size={18} />
                  <span className="text-sm font-medium">File Size</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {originalSize} KB
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-[400px] flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <ImageIcon size={64} strokeWidth={1.5} />
            <p className="mt-4 text-lg">No image selected</p>
            <p className="text-sm">Choose an image to get started</p>
          </div>
        )}

        {/* Add Image Button */}
        <div className="relative">
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-lg font-medium text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
            <Plus size={24} />
            {src ? 'Change Image' : 'Add Image'}
            <input 
              type="file"
              accept="image/*"
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              onChange={chooseImage}
            />
          </button>
        </div>

        {/* Compression Controls - Only show when image is selected */}
        {src && (
          <div className="space-y-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
            
            {/* Quality Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-gray-700 font-medium">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <span className="text-sm text-gray-500">
                  {quality < 0.3 ? 'Maximum' : quality < 0.6 ? 'Good' : 'Best'} Compression
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Small file</span>
                <span>Best quality</span>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-gray-700 font-medium block">Output Format</label>
              <div className="flex gap-3">
                {['webp', 'jpg', 'png'].map((fmt) => (
                  <label 
                    key={fmt}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all cursor-pointer
                      ${format === fmt 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                  >
                    <input
                      type="radio"
                      value={fmt}
                      checked={format === fmt}
                      onChange={(e) => setFormat(e.target.value)}
                      className="hidden"
                    />
                    <span className="font-medium uppercase">{fmt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Compression Results */}
            {showComparison && compressedSize && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Compressed Size:</span>
                  <span className="text-xl font-bold text-green-600">{compressedSize} KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Reduction:</span>
                  <span className="text-lg font-semibold text-green-600">
                    {getSizeReduction()}% smaller
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getSizeReduction()}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button 
                onClick={compressImage}
                disabled={isCompressing}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-lg font-medium text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompressing ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Compress & Download
                  </>
                )}
              </button>
            </div>

            {/* Reset Button - Small */}
            {src && (
              <button
                onClick={resetImage}
                className="w-full text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 py-2 transition-colors"
              >
                <Trash2 size={16} />
                Clear all and start over
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App