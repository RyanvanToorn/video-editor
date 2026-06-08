# Video Editor

A browser-based video editing application built with React, TypeScript, and Vite. Trim, rescale, and download videos entirely in-browser using FFmpeg.wasm.

> **Disclaimer**: This project was generated with AI assistance but has been thoroughly reviewed and manually refined.

## Features

- **Upload**: Drag-and-drop, browse, or paste videos from clipboard
- **Trim**: Adjust start/end points with real-time sliders or manual time input (HH:MM:SS)
- **Rescale**: Reduce resolution (25-100%) to minimize file size
- **Download**: Process and download edited videos directly in the browser
- **Zero Server**: All processing happens locally—no uploads to external servers

## Quick Start

1. Upload a video (drag-drop, browse, or paste)
2. Optionally trim and/or rescale
3. Click Download to process and save
4. Click Clear to start over

## Installation & Setup

```bash
pnpm install     # Install dependencies
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm preview     # Preview production build
```

## Tech Stack

- **React** 19.2.6 + TypeScript 6.0.2
- **Vite** 8.0.12 (build tool)
- **FFmpeg.wasm** (browser-based video processing)
- **CSS3** (Grid, Flexbox, Gradients)

## Browser Support

Chrome/Chromium 90+, Firefox 87+, Safari 15+, Edge 90+ (WebAssembly support required)

## Project Structure

```
src/
├── App.tsx
├── components/ (VideoUpload, VideoPreview, TrimControls, RescaleControls, ActionButtons)
└── utils/videoProcessor.ts
```

## Notes

**Performance**: FFmpeg loads lazily on first use. Processing is entirely in-browser; speed depends on video codec, resolution, and system CPU. Larger files may take 1-5+ minutes.

**Limitations**: Max file size depends on browser memory. Format support varies by browser and FFmpeg. Mobile browsers may have memory constraints.

**Extending**: To add new features, create a component in `src/components/`, update `App.tsx` state, and add processing logic in `src/utils/videoProcessor.ts`.

## License

This project is open source and available for modification and distribution.
