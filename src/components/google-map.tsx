import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { AlertCircle, MapIcon } from "lucide-react"

type Location = {
  id: string
  name: string
  lat: number
  lng: number
  type: "mentioned" | "recommended" | "route"
  description?: string
}

type GoogleMapProps = {
  locations: Location[]
  routePoints?: Location[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (location: Location) => void
}

export function GoogleMap({
  locations = [],
  routePoints = [],
  center = { lat: 35.6762, lng: 139.6503 }, // Default to Tokyo
  zoom = 12,
  onMarkerClick,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null)
  const [google, setGoogle] = useState<typeof google.maps | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load Google Maps API
  useEffect(() => {
    const initMap = async () => {
      setLoading(true)
      setError(null)

      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

        if (!apiKey || apiKey === "your_google_maps_api_key_here") {
          throw new Error("Google Maps API key is missing or invalid")
        }

        const loader = new Loader({
          apiKey,
          version: "weekly",
        })

        const googleMaps = await loader.load()
        setGoogle(googleMaps.maps)

        if (mapRef.current) {
          const mapInstance = new googleMaps.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          })
          setMap(mapInstance)
        }
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError(err instanceof Error ? err.message : "Failed to load Google Maps")
      } finally {
        setLoading(false)
      }
    }

    initMap()
  }, [center, zoom])

  // Update markers when locations change
  useEffect(() => {
    if (!map || !google) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Add new markers
    locations.forEach((location) => {
      const markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: location.type === "recommended" ? "#88C58F" : location.type === "route" ? "#A6E6E7" : "#ACC0A5",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
        scale: 8,
      }

      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: markerIcon,
        animation: google.maps.Animation.DROP,
      })

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${location.name}</h3>
            ${location.description ? `<p style="font-size: 12px;">${location.description}</p>` : ""}
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
        if (onMarkerClick) {
          onMarkerClick(location)
        }
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Draw route if routePoints exist
    if (routePoints.length > 1) {
      if (polyline) {
        polyline.setMap(null)
      }

      const path = routePoints.map((point) => ({ lat: point.lat, lng: point.lng }))
      const newPolyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#A6E6E7",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      })

      newPolyline.setMap(map)
      setPolyline(newPolyline)
    }

    // Fit bounds to include all markers
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng })
      })
      map.fitBounds(bounds)

      // Don't zoom in too far
      if (map.getZoom() > 15) {
        map.setZoom(15)
      }
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null))
      if (polyline) {
        polyline.setMap(null)
      }
    }
  }, [map, locations, routePoints, onMarkerClick, google])

  if (error) {
    return (
      <div className="w-full h-full rounded-lg bg-muted/30 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Unable to load map</h3>
        <p className="text-sm text-foreground/70 mb-4">{error}. Please check your API key configuration.</p>
        <div className="bg-secondary/20 p-4 rounded-md text-sm text-left w-full max-w-md">
          <p className="font-medium mb-2">Locations in this area:</p>
          <ul className="space-y-2">
            {locations.map((location) => (
              <li key={location.id} className="flex items-start">
                <span
                  className={`h-3 w-3 rounded-full mt-1 mr-2 ${
                    location.type === "recommended"
                      ? "bg-accent"
                      : location.type === "route"
                        ? "bg-secondary"
                        : "bg-primary"
                  }`}
                />
                <div>
                  <p className="font-medium">{location.name}</p>
                  {location.description && <p className="text-xs text-foreground/70">{location.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full h-full rounded-lg bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-pulse h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center mb-4">
            <MapIcon className="h-8 w-8 text-primary animate-bounce" />
          </div>
          <p className="text-sm text-foreground/70">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}

