import { useCallback, useEffect, useState } from "react";

export function usePhotoViewer(photos) {
  const [showPhotos, setShowPhotos] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const openViewer = useCallback((i) => {
    setViewerIndex(i);
    setZoomed(false);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    setZoomed(false);
  }, []);

  const next = useCallback(() => {
    if (!photos?.length) return;
    setViewerIndex((i) => (i + 1) % photos.length);
    setZoomed(false);
  }, [photos]);

  const prev = useCallback(() => {
    if (!photos?.length) return;
    setViewerIndex((i) => (i - 1 + photos.length) % photos.length);
    setZoomed(false);
  }, [photos]);

  useEffect(() => {
    if (!viewerOpen) return;

    function onKeyDown(e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeViewer();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerOpen, next, prev, closeViewer]);

  const resetForPlaceChange = useCallback(() => {
    setShowPhotos(false);
    setViewerOpen(false);
    setZoomed(false);
    setViewerIndex(0);
  }, []);

  return {
    showPhotos,
    setShowPhotos,

    viewerOpen,
    viewerIndex,
    setViewerIndex,
    zoomed,
    setZoomed,

    openViewer,
    closeViewer,
    next,
    prev,

    resetForPlaceChange,
  };
}