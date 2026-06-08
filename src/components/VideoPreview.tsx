import { useEffect, useRef } from 'react'

interface VideoPreviewProps {
  videoUrl: string | null
  onDurationUpdate: (duration: number) => void
}

export default function VideoPreview({ videoUrl, onDurationUpdate }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      onDurationUpdate(video.duration)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [onDurationUpdate])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="video-preview-section">
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Preview</h3>
      <div className="video-preview-container">
        {videoUrl && (
          <video 
            ref={videoRef}
            src={videoUrl} 
            controls
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
      {videoRef.current && !isNaN(videoRef.current.duration) && (
        <div className="duration-display">
          Duration: {formatTime(videoRef.current.duration)}
        </div>
      )}
    </div>
  )
}
