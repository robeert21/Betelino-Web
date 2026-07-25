"use client";

import { useEffect, useRef, useState } from "react";

// There's no server-side thumbnail generation (would need video processing
// infra this project doesn't have), so instead: load just enough of the clip
// to seek slightly past frame 0 (often black on camcorder/phone exports),
// snapshot that frame to a canvas, then swap the <video> for a plain <img>
// of the still — much cheaper to keep mounted in a grid than a live video
// element, and it actually shows something instead of a black box.
export function VideoThumbnail({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function handleLoadedMetadata() {
      if (!video) return;
      const duration = video.duration;
      video.currentTime = Number.isFinite(duration) ? Math.min(0.5, duration / 2) : 0;
    }

    function handleSeeked() {
      if (!video || !video.videoWidth || !video.videoHeight) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL("image/jpeg", 0.7));
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  if (thumbnail) {
    return <img src={thumbnail} alt="" className={className} />;
  }

  return (
    <video ref={videoRef} src={src} className={className} muted playsInline preload="metadata" />
  );
}
