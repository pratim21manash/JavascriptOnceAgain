import React from "react"
import "animate.css"
import { useRef } from "react"
import { useState } from "react"
import { useEffect } from "react"

const App = () => {
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [url, setUrl] = useState(null)
  const [recordingState, setRecordingState] = useState("inactive")
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioDevices, setAudioDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState("")
  const [volume, setVolume] = useState(0)
  const [recordings, setRecordings] = useState([])
  const [isMeterActive, setIsMeterActive] = useState(false)
  const timerRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)

  // Load saved recordings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recordings")
    if (saved) {
      setRecordings(JSON.parse(saved))
    }
  }, [])

  // Get available audio devices
  const getAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = devices.filter(device => device.kind === "audioinput")
      setAudioDevices(audioInputs)
      if (audioInputs.length > 0) {
        setSelectedDevice(audioInputs[0].deviceId)
      }
    } catch (err) {
      console.log("Error getting devices - ", err.message)
    }
  }

  useEffect(() => {
    getAudioDevices()
  }, [])

  // Timer for recording duration
  useEffect(() => {
    if (recordingState === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [recordingState])

  // Setup volume meter
  const setupVolumeMeter = (stream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    analyserRef.current = audioContextRef.current.createAnalyser()
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
    sourceRef.current.connect(analyserRef.current)
    
    analyserRef.current.fftSize = 256
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const updateVolume = () => {
      if (recordingState === "recording" || recordingState === "paused") {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setVolume(average)
        requestAnimationFrame(updateVolume)
      }
    }
    updateVolume()
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const constraints = {
        audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      setupVolumeMeter(stream)
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start(1000)
      setRecordingState("recording")
      setRecordingTime(0)

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const u = URL.createObjectURL(blob)
        setUrl(u)
        
        // Save recording info
        const newRecording = {
          id: Date.now(),
          url: u,
          duration: recordingTime,
          date: new Date().toLocaleString(),
          name: `Recording ${recordings.length + 1}`
        }
        
        const updatedRecordings = [newRecording, ...recordings]
        setRecordings(updatedRecordings)
        localStorage.setItem("recordings", JSON.stringify(updatedRecordings))
        
        // Cleanup
        chunksRef.current = []
        setRecordingState("inactive")
        setVolume(0)
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
      }

      mediaRecorderRef.current.onpause = () => {
        setRecordingState("paused")
      }

      mediaRecorderRef.current.onresume = () => {
        setRecordingState("recording")
      }
    }
    catch (err) {
      console.log("Error - ", err.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState !== "inactive") {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.pause()
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      mediaRecorderRef.current.resume()
    }
  }

  const downloadAudio = (link, filename = "recording.webm") => {
    const a = document.createElement("a")
    a.href = link
    a.download = filename
    a.click()
  }

  const deleteRecording = (id) => {
    const updated = recordings.filter(rec => rec.id !== id)
    setRecordings(updated)
    localStorage.setItem("recordings", JSON.stringify(updated))
    if (updated.length === 0) {
      setUrl(null)
    }
  }

  const clearAllRecordings = () => {
    setRecordings([])
    localStorage.removeItem("recordings")
    setUrl(null)
  }

  const volumeBarHeight = (volume / 255) * 100

  return (
    <div className="overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="animate__animated animate__slideInUp w-[450px] bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-6 text-white"> 🎤 Voice Recorder Pro</h1>
        
        {/* Device Selection */}
        {audioDevices.length > 0 && (
          <div className="mb-4">
            <select 
              value={selectedDevice} 
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={recordingState !== "inactive"}
            >
              {audioDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId} className="text-gray-900">
                  {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timer */}
        <div className="text-center text-5xl font-mono mb-4 text-white/90">
          {formatTime(recordingTime)}
        </div>

        {/* Volume Meter */}
        <div className="mb-6 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-purple-500 transition-all duration-100"
            style={{ width: `${volumeBarHeight}%` }}
          />
        </div>

        {/* Recording Status */}
        <div className="text-center mb-4">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            recordingState === "recording" ? "bg-red-500/80 animate-pulse" :
            recordingState === "paused" ? "bg-yellow-500/80" : "bg-gray-500/80"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              recordingState === "recording" ? "bg-white animate-pulse" :
              recordingState === "paused" ? "bg-yellow-200" : "bg-gray-300"
            }`} />
            {recordingState === "recording" ? "Recording" : 
             recordingState === "paused" ? "Paused" : "Ready"}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          {recordingState === "inactive" ? (
            <button 
              onClick={startRecording} 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 transition text-white font-semibold shadow-lg"
            >
              🎙️ Start
            </button>
          ) : (
            <>
              {recordingState === "recording" ? (
                <button 
                  onClick={pauseRecording}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 active:scale-95 transition text-white font-semibold shadow-lg"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button 
                  onClick={resumeRecording}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 transition text-white font-semibold shadow-lg"
                >
                  ▶️ Resume
                </button>
              )}
              <button 
                onClick={stopRecording}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-95 transition text-white font-semibold shadow-lg"
              >
                ⏹️ Stop
              </button>
            </>
          )}
        </div>

        {/* Current Recording */}
        {url && (
          <div className="space-y-4 mb-6 animate__animated animate__fadeIn">
            <audio
              src={url}
              controls
              className="w-full rounded-xl"
            />
            <button 
              onClick={() => downloadAudio(url, `recording-${Date.now()}.webm`)} 
              className="w-full text-white py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              💾 Download Current
            </button>
          </div>
        )}

        {/* Recordings History */}
        {recordings.length > 0 && (
          <div className="mt-6 border-t border-white/20 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-white font-semibold">📼 Recent Recordings</h2>
              <button 
                onClick={clearAllRecordings}
                className="text-sm px-3 py-1 rounded-lg bg-red-500/50 hover:bg-red-500/70 text-white transition"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {recordings.slice(0, 5).map(rec => (
                <div key={rec.id} className="bg-white/5 rounded-lg p-2 flex items-center justify-between group hover:bg-white/10 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{rec.name}</p>
                    <p className="text-white/50 text-xs">{formatTime(rec.duration)} • {rec.date}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={() => downloadAudio(rec.url, `${rec.name}.webm`)}
                      className="p-1.5 rounded-lg bg-blue-500/50 hover:bg-blue-500/70 text-white text-xs"
                    >
                      💾
                    </button>
                    <button 
                      onClick={() => deleteRecording(rec.id)}
                      className="p-1.5 rounded-lg bg-red-500/50 hover:bg-red-500/70 text-white text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}

export default App