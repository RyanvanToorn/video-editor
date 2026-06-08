interface ActionButtonsProps {
  isProcessing: boolean
  onDownload: () => Promise<void>
  onClear: () => void
}

export default function ActionButtons({ isProcessing, onDownload, onClear }: ActionButtonsProps) {
  return (
    <div className="action-buttons">
      <button 
        className="action-button download"
        onClick={onDownload}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <span>⏳</span> Processing...
          </>
        ) : (
          <>
            <span>⬇️</span> Download
          </>
        )}
      </button>
      <button 
        className="action-button clear"
        onClick={onClear}
        disabled={isProcessing}
      >
        <span>🔄</span> Clear
      </button>
    </div>
  )
}
