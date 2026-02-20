import { useMap } from "react-leaflet";

export default function Recenter({ coords, zoom = 5 }) {
  const map = useMap();
  map.setView(coords, zoom, { animate: true });
  return null;
}