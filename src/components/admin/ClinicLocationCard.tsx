import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, LocateFixed, ExternalLink } from "lucide-react";
import { Button, Spinner } from "docbook-ui-package";
import { toast } from "sonner";

export interface ClinicLocationCardProps {
  clinicName?: string;
  address?: string;
  latitude?: string | null;
  longitude?: string | null;
  isLoading?: boolean;
  onSaveLocation?: (coords: { latitude: string; longitude: string }) => Promise<void> | void;
  isSaving?: boolean;
  className?: string;
}

const DEFAULT_LAT = 9.9312328;
const DEFAULT_LNG = 76.2673041;

// Custom DocBook-branded SVG map pin icon (Retina-sharp, zero asset bundle dependencies)
const createPinIcon = () =>
  L.divIcon({
    className: "docbook-map-pin-marker",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25)); cursor: grab;">
        <div style="width: 36px; height: 36px; border-radius: 12px; background: #0000FF; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 4px 14px rgba(0,0,255,0.4);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #0000FF; border: 1.5px solid #ffffff; margin-top: -3px;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

/**
 * Dedicated Clinic Location Card for Larger Screens
 * Takes full width, displays location details and provides an inline interactive Leaflet map
 * with drag-and-drop / tap pin placement, GPS geolocation, and inline save.
 */
export default function ClinicLocationCard({
  clinicName = "Clinic",
  address = "",
  latitude,
  longitude,
  isLoading = false,
  onSaveLocation,
  isSaving = false,
  className = "",
}: ClinicLocationCardProps) {
  const parsedLat = latitude ? parseFloat(latitude) : DEFAULT_LAT;
  const parsedLng = longitude ? parseFloat(longitude) : DEFAULT_LNG;
  const validLat = isNaN(parsedLat) ? DEFAULT_LAT : parsedLat;
  const validLng = isNaN(parsedLng) ? DEFAULT_LNG : parsedLng;

  const [isEditingPin, setIsEditingPin] = useState(false);
  const [draftCoords, setDraftCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Active coordinates: draft when editing, otherwise prop coordinates
  const coords = isEditingPin && draftCoords ? draftCoords : { lat: validLat, lng: validLng };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Synchronize external Leaflet instance when prop coordinates change
  useEffect(() => {
    if (!isEditingPin && markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([validLat, validLng]);
      mapInstanceRef.current.setView([validLat, validLng], 14);
    }
  }, [validLat, validLng, isEditingPin]);

  // Initialize Leaflet Map whenever container becomes available and data finishes loading
  useEffect(() => {
    if (isLoading || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter: [number, number] = [validLat, validLng];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(initialCenter, {
      icon: createPinIcon(),
      draggable: isEditingPin,
    }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      setDraftCoords({ lat: pos.lat, lng: pos.lng });
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setDraftCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Ensure tiles render cleanly after mounting and when container resizes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [isLoading, validLat, validLng]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update draggable state when entering / leaving pin edit mode
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;
    if (isEditingPin) {
      markerRef.current.dragging?.enable();
      mapInstanceRef.current.scrollWheelZoom.enable();
    } else {
      markerRef.current.dragging?.disable();
      mapInstanceRef.current.scrollWheelZoom.disable();
    }
  }, [isEditingPin]);

  const handleToggleEdit = () => {
    if (isEditingPin) {
      // Revert to original coordinates
      if (markerRef.current && mapInstanceRef.current) {
        markerRef.current.setLatLng([validLat, validLng]);
        mapInstanceRef.current.setView([validLat, validLng], 14);
      }
      setDraftCoords(null);
      setIsEditingPin(false);
    } else {
      setDraftCoords({ lat: validLat, lng: validLng });
      setIsEditingPin(true);
      toast.info("Click or drag the pin on the map to set your clinic coordinates.");
    }
  };

  const handleSave = async () => {
    if (!onSaveLocation) return;
    try {
      await onSaveLocation({
        latitude: coords.lat.toString(),
        longitude: coords.lng.toString(),
      });
      setIsEditingPin(false);
      setDraftCoords(null);
      toast.success("Location updated successfully!");
    } catch {
      // Handled by parent mutation toast
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        const { latitude: curLat, longitude: curLng } = position.coords;
        setDraftCoords({ lat: curLat, lng: curLng });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([curLat, curLng], 16, { animate: true });
          markerRef.current.setLatLng([curLat, curLng]);
        }
        toast.success("Detected your current location!");
      },
      (error) => {
        setIsDetecting(false);
        toast.error(`Unable to retrieve your location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  if (isLoading) {
    return (
      <div
        className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-6 flex items-center justify-center min-h-[220px] shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] ${className}`.trim()}
      >
        <Spinner size="md" className="text-primary" />
      </div>
    );
  }

  const mapQuery = `${coords.lat},${coords.lng}`;

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-4 sm:p-5 shadow-[0_6px_24px_rgba(0,0,255,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex flex-col gap-3.5 transition-all select-none ${className}`.trim()}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 sm:size-10 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center shrink-0">
            <MapPin className="size-4.5 sm:size-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                Clinic Location & GPS Pinpoint
              </h2>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono border border-slate-200">
                {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
              {address ? `${clinicName} · ${address}` : `${clinicName} GPS coordinates`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-primary transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Open in Google Maps"
          >
            <span>Open Maps</span>
            <ExternalLink className="size-3" />
          </a>

          {!isEditingPin ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleToggleEdit}
              className="!min-h-9 !py-1.5 !px-3 !text-xs font-bold"
            >
          
              Adjust Pin on Map
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleToggleEdit}
                disabled={isSaving}
                className="!min-h-9 !py-1.5 !px-3 !text-xs font-bold"
              >
              
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
                disabled={isSaving}
                className="!min-h-9 !py-1.5 !px-3 !text-xs font-bold bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
              >
              
                Save Location
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-slate-100 my-0.5" />

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        {/* Active Pin Mode Floating Helper Bar */}
        {isEditingPin && (
          <div className="absolute top-3 left-3 right-3 z-[1000] bg-white/95 backdrop-blur-md border border-primary/30 shadow-lg rounded-xl p-2.5 flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
              <span className="font-medium text-xs">
                <strong>Pin Mode Active:</strong> Click anywhere or drag the pin to position your clinic.
              </span>
            </div>

            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isDetecting}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
            >
              {isDetecting ? (
                <Spinner size="sm" className="size-3 text-slate-700" />
              ) : (
                <LocateFixed className="size-3 text-primary" />
              )}
              <span>My Location</span>
            </button>
          </div>
        )}

        {/* Leaflet Map Mount Point */}
        <div ref={mapContainerRef} className="w-full h-72 sm:h-80 bg-slate-100 relative z-0" />

        {/* Coordinates Readout Footer Bar */}
        <div className="bg-slate-50/95 border-t border-slate-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Selected Coordinates:
            </span>
            <span className="font-mono text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
              Lat: {coords.lat.toFixed(7)}, Lng: {coords.lng.toFixed(7)}
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {isEditingPin ? "Unsaved changes" : "Synced with clinic profile"}
          </span>
        </div>
      </div>
    </div>
  );
}
