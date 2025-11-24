"use client";

import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LeafletMouseEvent } from "leaflet";
import { useMemo } from "react";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CENTER: L.LatLngExpression = [0, 0];

const GAME_SIZE = 6000;
const MAX_ZOOM = 3;
const TILE_SIZE = 512;

const CRS_SIZE_AT_ZOOM_0 = TILE_SIZE;
const SCALE = CRS_SIZE_AT_ZOOM_0 / GAME_SIZE;
const OFFSET = CRS_SIZE_AT_ZOOM_0 / 2;

const GTA_CRS = L.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(SCALE, OFFSET, -SCALE, OFFSET),
});

const BOUNDS: L.LatLngBoundsLiteral = [
  [-(GAME_SIZE / 2), -(GAME_SIZE / 2)],
  [GAME_SIZE / 2, GAME_SIZE / 2],
];

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (x: number, y: number) => void;
}) {
  useMapEvents({
    click: (event: LeafletMouseEvent) => {
      onMapClick(event.latlng.lng, event.latlng.lat);
    },
  });
  return null;
}

export interface MapMarker {
  id: string;
  type: "origin" | "destination";
  x: number;
  y: number;
}

export interface RoutePoint {
  x: number;
  y: number;
}

export function Map({
  onMapClick,
  markers,
  route,
}: {
  onMapClick: (x: number, y: number) => void;
  markers: MapMarker[];
  route: RoutePoint[];
}) {
  const polylineRoute = useMemo(() => {
    return route.map((point) => [point.y, point.x] as L.LatLngTuple);
  }, [route]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        style={{ width: "100%", height: "100%", background: "#0f172a" }}
        center={CENTER}
        zoom={0}
        minZoom={0}
        maxZoom={MAX_ZOOM}
        crs={GTA_CRS}
        maxBounds={BOUNDS}
        maxBoundsViscosity={0.5}
      >
        <TileLayer
          url="/tiles/sat.{z}.{x}.{y}.png"
          minZoom={0}
          maxZoom={MAX_ZOOM}
          tileSize={TILE_SIZE}
          noWrap={true}
          bounds={BOUNDS}
          keepBuffer={2}
        />
        <MapClickHandler onMapClick={onMapClick} />

        {markers.map((marker) => {
          return (
            <Marker
              key={marker.id}
              position={[marker.y, marker.x] as L.LatLngExpression}
            ></Marker>
          );
        })}

        {polylineRoute.length > 0 && (
          <>
            <Polyline
              positions={polylineRoute}
              pathOptions={{
                color: "#06b6d4",
                weight: 6,
                opacity: 0.7,
              }}
            />
            {/* <RouteBounds path={routePath} /> */}
          </>
        )}
      </MapContainer>
    </div>
  );
}
