import React, { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, X, LocateFixed } from "lucide-react";
import { Button, Spinner } from "docbook-ui-package";
import { toast } from "sonner";

export interface EditLocationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: string | null;
  initialLng?: string | null;
  clinicName?: string;
  onSave: (coords: { latitude: string; longitude: string }) => Promise<void> | void;
  isSaving?: boolean;
}

// Fallback to Kochi, Kerala if no coordinates are present
const DEFAULT_LAT = 9.9312328;
const DEFAULT_LNG = 76.2673041;

// Custom DocBook-branded SVG map pin icon (Retina-sharp, zero asset bundle dependencies)
const createPinIcon = () =>
  L.divIcon({
    className: "docbook-map-pin-marker",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25)); cursor: grab;">
        <div style="width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #1d4ed8, #2563eb); border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; color: #ffffff;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #1d4ed8; border: 1.5px solid #ffffff; margin-top: -3px;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

/**
 * Mobile-First Dedicated Map Location Picker Sheet
 * Allows the user to select, drag, or detect the exact clinic pin on an interactive map.
 */
export function EditLocationPopover({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  clinicName = "Clinic",
  onSave,
  isSaving = false,
}: EditLocationPopoverProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Parse initial coordinates or fall back
  const parsedLat = initialLat ? parseFloat(initialLat) : DEFAULT_LAT;
  const parsedLng = initialLng ? parseFloat(initialLng) : DEFAULT_LNG;
  const validLat = isNaN(parsedLat) ? DEFAULT_LAT : parsedLat;
  const validLng = isNaN(parsedLng) ? DEFAULT_LNG : parsedLng;

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: validLat,
    lng: validLng,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Smooth dismiss handler: animates out before triggering onClose
  const handleDismiss = useCallback(() => {
    if (isSaving || isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [isSaving, isClosing, onClose]);

  // Handle Escape key and lock background body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleDismiss]);

  // Initialize or re-center Leaflet Map when sheet opens
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing instance if container changed
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const currentCoords = { lat: validLat, lng: validLng };
    setSelectedCoords(currentCoords);

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([validLat, validLng], 15);

    // OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Draggable marker
    const marker = L.marker([validLat, validLng], {
      draggable: true,
      icon: createPinIcon(),
    }).addTo(map);

    // Update coordinates when marker is dragged
    marker.on("dragend", (e: L.LeafletEvent) => {
      const target = e.target as L.Marker;
      const latlng = target.getLatLng();
      setSelectedCoords({ lat: latlng.lat, lng: latlng.lng });
    });

    // Move marker when clicking anywhere on the map
    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setSelectedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate map size after slide transition completes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 350);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [isOpen, validLat, validLng]);

  // "Detect My Location" using browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;

        setSelectedCoords({ lat: newLat, lng: newLng });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 16, { animate: true });
          markerRef.current.setLatLng([newLat, newLng]);
        }

        setIsDetecting(false);
        toast.success("Location detected on map");
      },
      (err) => {
        setIsDetecting(false);
        toast.error("Unable to retrieve current location", {
          description: err.message,
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveLocation = async () => {
    try {
      await onSave({
        latitude: selectedCoords.lat.toFixed(6),
        longitude: selectedCoords.lng.toFixed(6),
      });
      handleDismiss();
    } catch {
      // Error handled by mutation toast
    }
  };

  // Touch drag-down detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (deltaY > 50) {
        handleDismiss();
      }
      setTouchStartY(null);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select Clinic Location"
      className={`fixed inset-0 z-[100] flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs select-none ${
        isClosing
          ? "animate-out fade-out-0 duration-300"
          : "animate-in fade-in-0 duration-300"
      }`}
      onClick={handleDismiss}
    >
      {/* Upward / Downward Sliding Sheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-white rounded-t-3xl border-t-2 border-primary/50 shadow-[0_-12px_40px_rgba(0,0,255,0.22),0_-2px_10px_rgba(0,0,0,0.1)] flex flex-col max-h-[92vh] overflow-hidden will-change-transform ${
          isClosing
            ? "animate-out slide-out-to-bottom duration-300 ease-in"
            : "animate-in slide-in-from-bottom duration-300 ease-out"
        }`}
      >
        {/* Mobile Pull Handle / Drag Indicator */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="pt-3 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1.5 bg-slate-300 rounded-full transition-colors hover:bg-slate-400" />
        </div>

        {/* Header */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
              <MapPin className="size-4.5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                Select Location on Map
              </h3>
              <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                Drag the pin or tap anywhere on the map for {clinicName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            disabled={isSaving}
            className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 shrink-0"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Map Body */}
        <div className="relative w-full h-[52vh] sm:h-[48vh] bg-slate-100 shrink-0">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating "Detect Location" Tool Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting || isSaving}
            className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-md hover:bg-white hover:text-primary transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isDetecting ? (
              <Spinner size="sm" className="size-3.5 text-primary" />
            ) : (
              <LocateFixed className="size-3.5 text-primary" />
            )}
            <span>{isDetecting ? "Detecting..." : "My Location"}</span>
          </button>

          {/* Instructions banner */}
          <div className="absolute bottom-2 inset-x-3 z-[400] pointer-events-none flex justify-center">
            <div className="px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-sm text-white text-[11px] font-medium shadow-md">
              Tap anywhere or drag the blue pin to position
            </div>
          </div>
        </div>

        {/* Bottom Coordinates & Action Footer */}
        <div className="p-4 pb-8 border-t border-slate-100 bg-white flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Selected Coordinates
            </span>
            <span className="font-mono font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
              {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDismiss}
              disabled={isSaving}
              className="flex-1 min-h-11 text-sm font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveLocation}
              isLoading={isSaving}
              disabled={isSaving}
              className="flex-1 min-h-11 text-sm font-bold"
            >
              Save Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditLocationPopover;
