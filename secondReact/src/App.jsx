import { Cctv, Disc, Square } from "lucide-react"
import { useReducer, useRef, useState } from "react"

const App = () => {
  const [isRecording, setRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunkRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start()
      setRecording(true)

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if(e.data.size > 0){
          chunkRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunkRef.current, {type: "video/mp4"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "sample.mp4"
        a.click()
        chunkRef.current = []
      }
    }
    catch(err){
      alert(err)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current.stop()
    setRecording(false)
  }

  return (
    <div className="bg-gray-200 h-screen flex items-center justify-center">
      {
        isRecording ? 
        <button onClick={stopRecording} className="flex items-center gap-2 hover:bg-rose-500 transition duration-300 active:scale-80 bg-rose-600 text-white font-medium rounded-lg px-16 py-3">
          <Square className="w-4 h-4"/>
          Stop Recording
        </button>
        :
        <button onClick={startRecording} className="flex items-center gap-2 hover:bg-blue-500 transition duration-300 active:scale-80 bg-blue-600 text-white font-medium rounded-lg px-16 py-3">
          <Disc className="w-4 h-4"/>
          Start Recording
        </button>
      }
    </div>
  )
}

export default App