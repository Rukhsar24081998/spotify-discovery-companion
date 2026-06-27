"use client";

import { useEffect, useState } from "react";
import { ARTWORK_PLACEHOLDER_SRC } from "@/lib/mockBrowseContent";

export { ARTWORK_PLACEHOLDER_SRC };

interface ArtworkImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
}

/**
 * Image with a local placeholder fallback when the source fails to load.
 */
export function ArtworkImage({
  src,
  alt = "",
  className = "",
  width,
  height,
  loading = "lazy",
  onLoad,
}: ArtworkImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  function handleError() {
    if (currentSrc !== ARTWORK_PLACEHOLDER_SRC) {
      setCurrentSrc(ARTWORK_PLACEHOLDER_SRC);
      setFailed(true);
    }
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onLoad={onLoad}
      onError={handleError}
      className={`${className}${failed ? " bg-[#282828] object-contain p-2" : ""}`}
    />
  );
}
