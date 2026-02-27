import { Cctv, Disc, Square, Clock, Download, Monitor, Mic, Video, AlertCircle } from "lucide-react"
import { useReducer, useRef, useState, useEffect } from "react"

const App = () => {
  const [isRecording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasPermission, setHasPermission] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [recordingName, setRecordingName] = useState("screen-recording")
  const mediaRecorderRef = useRef(null)
  const chunkRef = useRef([])
  const timerRef = useRef(null)

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start()
      setRecording(true)
      setHasPermission(true)
      setRecordingTime(0)

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if(e.data.size > 0){
          chunkRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunkRef.current, {type: "video/mp4"})
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        setShowPreview(true)
        
        // Auto download (keeping your original logic)
        const a = document.createElement("a")
        a.href = url
        a.download = `${recordingName || "screen-recording"}.mp4`
        a.click()
        
        chunkRef.current = []
        setRecording(false)
      }
    }
    catch(err){
      setHasPermission(false)
      alert("Please allow screen and audio access to record")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const downloadAgain = () => {
    if (previewUrl) {
      const a = document.createElement("a")
      a.href = previewUrl
      a.download = `${recordingName || "screen-recording"}.mp4`
      a.click()
    }
  }

  const resetRecording = () => {
    setShowPreview(false)
    setPreviewUrl(null)
    setRecordingName("screen-recording")
    setRecordingTime(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10"></div>
        
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-[480px] border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Cctv className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Screen Recorder</h1>
            <p className="text-gray-300 text-sm">Capture your screen with ease</p>
          </div>

          {/* Preview Section */}
          {showPreview && previewUrl && (
            <div className="mb-6 animate-fadeIn">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <video 
                  src={previewUrl} 
                  className="w-full rounded-lg mb-3"
                  controls
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recordingName}
                    onChange={(e) => setRecordingName(e.target.value)}
                    placeholder="Recording name"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={downloadAgain}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Card - Only show when recording */}
          {isRecording && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full absolute"></div>
                  <span className="text-white font-medium">Recording in progress</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-gray-300" />
                  <span className="font-mono text-xl">{formatTime(recordingTime)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
              <Monitor className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <span className="text-xs text-gray-300">Screen</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
              <Mic className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <span className="text-xs text-gray-300">Audio</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
              <Video className="w-5 h-5 text-pink-400 mx-auto mb-1" />
              <span className="text-xs text-gray-300">HD</span>
            </div>
          </div>

          {/* Permission Error */}
          {!hasPermission && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-6 flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>Please allow screen and audio access to record</p>
            </div>
          )}

          {/* Recording Stats - Show after recording */}
          {!isRecording && recordingTime > 0 && !showPreview && (
            <div className="bg-white/5 rounded-xl p-3 mb-6 text-center border border-white/10">
              <p className="text-gray-300 text-sm">
                Last recording: <span className="text-white font-mono">{formatTime(recordingTime)}</span>
              </p>
            </div>
          )}

          {/* Main Action Button */}
          <div className="relative">
            {isRecording ? (
              <button 
                onClick={stopRecording} 
                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 p-[2px] hover:from-rose-700 hover:to-pink-700 transition-all duration-300"
              >
                <div className="relative bg-slate-900 rounded-xl px-8 py-4 group-hover:bg-transparent transition-all duration-300">
                  <div className="flex items-center justify-center gap-3">
                    <Square className="w-5 h-5 text-white fill-white" />
                    <span className="text-white font-semibold text-lg">Stop Recording</span>
                  </div>
                </div>
              </button>
            ) : (
              <button 
                onClick={startRecording} 
                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <div className="relative bg-slate-900 rounded-xl px-8 py-4 group-hover:bg-transparent transition-all duration-300">
                  <div className="flex items-center justify-center gap-3">
                    <Disc className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-lg">Start Recording</span>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Reset Button - Show after recording */}
          {!isRecording && showPreview && (
            <button
              onClick={resetRecording}
              className="w-full mt-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl px-8 py-3 text-sm transition-all duration-300 border border-white/10"
            >
              Record New Video
            </button>
          )}

          {/* Tips */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Choose which screen or window to share when prompted
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default App