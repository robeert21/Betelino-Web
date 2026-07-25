import { PhotonImage, SamplingFilter, resize } from "@cf-wasm/photon/node";

const THUMB_MAX_DIMENSION = 480;
const THUMB_QUALITY = 55;

// Grid tiles only need a small preview, but uploads come straight from
// camera photos (often several MB) — without a real resize, every tile in
// the gallery grid downloads the full original just to render at a few
// hundred pixels. Photon runs entirely in WASM so it works inside the
// Worker at upload time, no native image lib required.
export function makeGalleryThumbnail(bytes: ArrayBuffer): Uint8Array {
  const input = PhotonImage.new_from_byteslice(new Uint8Array(bytes));
  try {
    const width = input.get_width();
    const height = input.get_height();
    const scale = Math.min(1, THUMB_MAX_DIMENSION / Math.max(width, height));
    const output = resize(
      input,
      Math.round(width * scale),
      Math.round(height * scale),
      SamplingFilter.Nearest,
    );
    try {
      return output.get_bytes_jpeg(THUMB_QUALITY);
    } finally {
      output.free();
    }
  } finally {
    input.free();
  }
}
