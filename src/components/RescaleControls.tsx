interface RescaleControlsProps {
  scale: number
  onScaleChange: (value: number) => void
}

export default function RescaleControls({ scale, onScaleChange }: RescaleControlsProps) {
  const getResolutionInfo = (scalePercent: number) => {
    // Assuming original is 1080p
    const originalHeight = 1080
    const newHeight = Math.round((originalHeight * scalePercent) / 100)
    return `${newHeight}p`
  }

  return (
    <div>
      <h3>📐 Rescale</h3>
      
      <div className="rescale-slider">
        <label>Output Scale</label>
        <input
          type="range"
          min="25"
          max="100"
          value={scale}
          onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          className="slider"
          step="5"
        />
        <div className="scale-value">
          <span>Scale:</span>
          <span className="scale-value-current">{scale}%</span>
        </div>
        <div className="scale-info">
          Output: {getResolutionInfo(scale)} ({Math.round(scale * 1.78)}% of width)
        </div>
      </div>
    </div>
  )
}
