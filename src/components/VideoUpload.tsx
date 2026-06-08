import { useRef, useState } from 'react'

interface VideoUploadProps {
  onVideoUpload: (file: File) => void
}

export default function VideoUpload({ onVideoUpload }: VideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      onVideoUpload(file)
    } else {
      alert('Please select a valid video file')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let item of items) {
      if (item.type.startsWith('video/') || item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file && file.type.startsWith('video/')) {
          handleFileSelect(file)
          break
        }
      }
    }
  }

  return (
    <div className="upload-container" onPaste={handlePaste}>
      <div 
        className={`upload-zone ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click()
          }
        }}
      >
        <div className="upload-icon">📹</div>
        <p className="upload-text"><strong>Drop your video here</strong></p>
        <p className="upload-text hint">or click to browse</p>
        <p className="upload-text hint" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
          Also supports pasting videos from your clipboard
        </p>
        
        <div className="upload-actions">
          <button 
            className="upload-button"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            Browse
          </button>
        </div>
        
        <input 
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}
