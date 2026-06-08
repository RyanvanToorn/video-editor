import { FFmpeg, toBlobURL } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

// Create a singleton instance
let ffmpegInstance: FFmpeg | null = null
let ffmpegReady = false

async function initFFmpeg() {
  if (ffmpegReady && ffmpegInstance) {
    return ffmpegInstance
  }

  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg()
  }

  if (!ffmpegReady) {
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'
    
    ffmpegInstance.on('log', ({ type, message }) => {
      if (type === 'error') {
        console.error('[FFmpeg]', message)
      }
    })

    try {
      await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      ffmpegReady = true
    } catch (error) {
      console.error('Failed to load FFmpeg:', error)
      throw new Error('Failed to load video processing library')
    }
  }

  return ffmpegInstance
}

export async function processVideo(
  file: File,
  startTime: number,
  endTime: number,
  scale: number
): Promise<Blob> {
  try {
    const ffmpeg = await initFFmpeg()

    if (!ffmpeg.isLoaded()) {
      throw new Error('FFmpeg is not loaded')
    }

    // Generate unique filenames to avoid conflicts
    const timestamp = Date.now()
    const inputFileName = `input_${timestamp}.${file.name.split('.').pop() || 'mp4'}`
    const outputFileName = `output_${timestamp}.mp4`

    // Write input file to FFmpeg virtual filesystem
    await ffmpeg.writeFile(inputFileName, await fetchFile(file))

    // Build FFmpeg command
    const duration = endTime - startTime
    const scaleFilter = scale < 100 ? `scale=trunc(iw*${scale/100}):trunc(ih*${scale/100})` : ''
    const filterComplex = scaleFilter ? `-vf "${scaleFilter}"` : ''

    // Trim and optionally scale the video
    const command = [
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-i', inputFileName,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      ...(scaleFilter ? ['-vf', scaleFilter] : []),
      outputFileName
    ]

    await ffmpeg.exec(command)

    // Read output file
    const data = await ffmpeg.readFile(outputFileName)

    // Clean up
    await ffmpeg.deleteFile(inputFileName)
    await ffmpeg.deleteFile(outputFileName)

    // Convert to Blob
    const blob = new Blob([data], { type: 'video/mp4' })
    return blob
  } catch (error) {
    console.error('Error processing video:', error)
    throw error
  }
}
