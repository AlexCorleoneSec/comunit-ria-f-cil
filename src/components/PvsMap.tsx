import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Fix leaflet default icons
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
  onChange: (data: { center: [number, number]; start: [number, number] | null; end: [number, number] | null }) => void;
  endereco?: string;
}

function ClickHandler({ onStart, onEnd, clickMode }: { onStart: (pos: [number, number]) => void; onEnd: (pos: [number, number]) => void; clickMode: "start" | "end" }) {
  useMapEvents({
    click(e) {
      const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
      if (clickMode === "start") onStart(pos);
      else onEnd(pos);
    },
  });
  return null;
}

function SearchControl({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <div className="flex gap-2 mb-3">
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar endereço..."
        className="h-9 text-sm"
        onKeyDown={e => e.key === "Enter" && onSearch(query)}
      />
      <Button size="sm" variant="outline" onClick={() => onSearch(query)}>
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function PvsMap({ onChange, endereco }: Props) {
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number]>([-23.5505, -46.6333]); // SP
  const [clickMode, setClickMode] = useState<"start" | "end">("start");
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  useEffect(() => {
    if (start) {
      onChange({ center: start, start, end });
      setClickMode("end");
    }
  }, [start]);

  useEffect(() => {
    if (end) {
      onChange({ center: start || center, start, end });
    }
  }, [end]);

  const handleSearch = async (query: string) => {
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setFlyTarget({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch {}
  };

  return (
    <div>
      <SearchControl onSearch={handleSearch} />
      <div className="flex gap-2 mb-3">
        <Button
          size="sm"
          variant={clickMode === "start" ? "default" : "outline"}
          onClick={() => setClickMode("start")}
          className="text-xs"
        >
          Ponto Inicial
        </Button>
        <Button
          size="sm"
          variant={clickMode === "end" ? "default" : "outline"}
          onClick={() => setClickMode("end")}
          className="text-xs"
        >
          Ponto Final
        </Button>
      </div>
      <div className="rounded-lg overflow-hidden border" style={{ height: 400 }}>
        <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onStart={setStart} onEnd={setEnd} clickMode={clickMode} />
          {flyTarget.lat !== 0 && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} />}
          {start && <Marker position={start} icon={greenIcon} />}
          {end && <Marker position={end} icon={redIcon} />}
          {start && end && <Polyline positions={[start, end]} color="hsl(215, 60%, 22%)" weight={3} />}
        </MapContainer>
      </div>
    </div>
  );
}
