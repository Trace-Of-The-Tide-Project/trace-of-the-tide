/**
 * Detects likely video URLs from path/extension (cover + inline media share the same URL field).
 * Also treats API routes like `/videos/{id}` or `videos/{id}` as video.
 */
const VIDEO_PATH_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i;
/** Path contains a `/videos/` segment (e.g. `/videos/abc`, `https://host/api/videos/abc`). */
const VIDEOS_ROUTE = /(^|\/)(videos)\/[^/?#]/i;

export function isLikelyVideoUrl(raw: string | null | undefined): boolean {
  if (raw == null) return false;
  const s = String(raw).trim();
  if (!s) return false;
  const pathPart = s.split("?")[0]?.split("#")[0] ?? s;
  if (VIDEOS_ROUTE.test(pathPart)) return true;
  return VIDEO_PATH_EXT.test(pathPart);
}

const AUDIO_PATH_EXT = /\.(mp3|m4a|aac|wav|ogg|oga|opus|flac|weba|mpeg)(\?|#|$)/i;
const AUDIO_ROUTE = /(^|\/)(audio)\/[^/?#]/i;

export function isLikelyAudioUrl(raw: string | null | undefined): boolean {
  if (raw == null) return false;
  const s = String(raw).trim();
  if (!s) return false;
  const pathPart = s.split("?")[0]?.split("#")[0] ?? s;
  if (AUDIO_ROUTE.test(pathPart)) return true;
  return AUDIO_PATH_EXT.test(pathPart);
}
