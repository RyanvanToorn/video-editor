interface TrimControlsProps {
  start: number
  end: number
  duration: number
  onStartChange: (value: number) => void
  onEndChange: (value: number) => void
}

export default function TrimControls({
  start,
  end,
  duration,
  onStartChange,
  onEndChange,
}: TrimControlsProps) {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleStartChange = (value: number) => {
    if (value < end) {
      onStartChange(value)
    }
  }

  const handleEndChange = (value: number) => {
    if (value > start) {
      onEndChange(value)
    }
  }

  const handleStartTimeInput = (timeStr: string) => {
    const parts = timeStr.split(':')
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0
      const minutes = parseInt(parts[1]) || 0
      const seconds = parseInt(parts[2]) || 0
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      handleStartChange(Math.min(totalSeconds, duration))
    }
  }

  const handleEndTimeInput = (timeStr: string) => {
    const parts = timeStr.split(':')
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0
      const minutes = parseInt(parts[1]) || 0
      const seconds = parseInt(parts[2]) || 0
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      handleEndChange(Math.min(totalSeconds, duration))
    }
  }

  return (
    <div>
      <h3>✂️ Trim</h3>
      
      <div className="trim-slider">
        <label>Start Time</label>
        <input
          type="range"
          min="0"
          max={duration}
          value={start}
          onChange={(e) => handleStartChange(parseFloat(e.target.value))}
          className="slider"
        />
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {formatTime(start)} / {formatTime(duration)}
        </span>
      </div>

      <div className="trim-slider">
        <label>End Time</label>
        <input
          type="range"
          min={start}
          max={duration}
          value={end}
          onChange={(e) => handleEndChange(parseFloat(e.target.value))}
          className="slider"
        />
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {formatTime(end)} / {formatTime(duration)}
        </span>
      </div>

      <div className="time-display">
        <div className="time-input-group">
          <label>Start (HH:MM:SS)</label>
          <input
            type="text"
            value={formatTime(start)}
            onChange={(e) => handleStartTimeInput(e.target.value)}
            placeholder="00:00:00"
          />
        </div>
        <div className="time-input-group">
          <label>End (HH:MM:SS)</label>
          <input
            type="text"
            value={formatTime(end)}
            onChange={(e) => handleEndTimeInput(e.target.value)}
            placeholder="00:00:00"
          />
        </div>
      </div>
    </div>
  )
}
