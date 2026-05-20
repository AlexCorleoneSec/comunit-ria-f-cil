import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  start: [number, number] | null;
  end: [number, number] | null;
  height?: number;
}

export default function PvsMapView({ start, end, height = 300 }: Props) {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!start || !end) {
      setRoute([]);
      setDistance(null);
      return;
    }
    (async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          setRoute(data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]));
          setDistance(data.routes[0].distance);
        } else {
          setRoute([start, end]);
        }
      } catch {
        setRoute([start, end]);
      }
    })();
  }, [start?.[0], start?.[1], end?.[0], end?.[1]]);

  if (!start && !end) {
    return (
      <div className="text-xs text-muted-foreground text-center py-4 border rounded-lg">
        Sem coordenadas cadastradas para exibir no mapa.
      </div>
    );
  }

  const center: [number, number] = start || end!;
  const bounds = start && end ? L.latLngBounds([start, end]).pad(0.3) : undefined;

  return (
    <div>
      {distance !== null && (
        <div className="mb-2 text-center text-xs font-medium text-primary">
          Distância do trajeto: {(distance / 1000).toFixed(2)} km
        </div>
      )}
      <div className="rounded-lg overflow-hidden border" style={{ height }}>
        <MapContainer
          center={center}
          zoom={14}
          bounds={bounds}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {start && <Marker position={start} icon={greenIcon} />}
          {end && <Marker position={end} icon={redIcon} />}
          {route.length > 1 && (
            <Polyline positions={route} color="hsl(215, 80%, 45%)" weight={5} opacity={0.8} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}