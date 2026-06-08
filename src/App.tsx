
import { useState } from 'react'
import VideoUpload from './components/VideoUpload'
import VideoPreview from './components/VideoPreview'
import TrimControls from './components/TrimControls'
import RescaleControls from './components/RescaleControls'
import ActionButtons from './components/ActionButtons'
import './App.css'

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Edit state
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [scale, setScale] = useState(100)

  const handleVideoUpload = (file: File) => {
    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setTrimStart(0)
    setTrimEnd(0)
    setScale(100)
  }

  const handleClearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    setVideoFile(null)
    setVideoUrl(null)
    setTrimStart(0)
    setTrimEnd(0)
    setVideoDuration(0)
    setScale(100)
  }

  const handleDurationUpdate = (duration: number) => {
    setVideoDuration(duration)
    if (trimEnd === 0) {
      setTrimEnd(duration)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Video Editor</h1>
        <p className="subtitle">Upload, trim, and rescale your videos</p>
      </header>

      <main className="app-main">
        {!videoFile ? (
          <VideoUpload onVideoUpload={handleVideoUpload} />
        ) : (
          <div className="editor-container">
            <div className="preview-section">
              <VideoPreview 
                videoUrl={videoUrl} 
                onDurationUpdate={handleDurationUpdate}
              />
            </div>

            <div className="controls-section">
              <div className="controls-group">
                <TrimControls
                  start={trimStart}
                  end={trimEnd}
                  duration={videoDuration}
                  onStartChange={setTrimStart}
                  onEndChange={setTrimEnd}
                />
              </div>

              <div className="controls-group">
                <RescaleControls
                  scale={scale}
                  onScaleChange={setScale}
                />
              </div>

              <ActionButtons
                isProcessing={isProcessing}
                onDownload={async () => {
                  if (videoFile) {
                    setIsProcessing(true)
                    try {
                      // Import processor dynamically to avoid loading FFmpeg unnecessarily
                      const { processVideo } = await import('./utils/videoProcessor')
                      const outputBlob = await processVideo(
                        videoFile,
                        trimStart,
                        trimEnd,
                        scale
                      )
                      
                      // Download the file
                      const url = URL.createObjectURL(outputBlob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `video_edited_${Date.now()}.mp4`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    } catch (error) {
                      console.error('Error processing video:', error)
                      alert('Error processing video. Please try again.')
                    } finally {
                      setIsProcessing(false)
                    }
                  }
                }}
                onClear={handleClearVideo}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
