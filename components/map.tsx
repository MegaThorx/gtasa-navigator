"use client";

import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
  Circle,
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
  onMapMove,
}: {
  onMapClick: (x: number, y: number) => void;
  onMapMove?: (center: { x: number; y: number }) => void;
}) {
  useMapEvents({
    click: (event: LeafletMouseEvent) => {
      onMapClick(event.latlng.lng, event.latlng.lat);
    },
    moveend: (event) => {
      if (onMapMove) {
        const center = event.target.getCenter();
        onMapMove({ x: center.lng, y: center.lat });
      }
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

export interface RoadNode {
  id: string | number;
  x: number;
  y: number;
  z: number;
}

export interface RoadConnection {
  from: string | number;
  to: string | number;
}

export function Map({
  onMapClickAction: onMapClick,
  onMapMoveAction: onMapMove,
  markers,
  route,
  roadNodes,
  roadConnections,
}: {
  onMapClickAction: (x: number, y: number) => void;
  onMapMoveAction?: (center: { x: number; y: number }) => void;
  markers: MapMarker[];
  route: RoutePoint[];
  roadNodes?: RoadNode[];
  roadConnections?: RoadConnection[];
}) {
  const polylineRoute = useMemo(() => {
    return route.map((point) => [point.y, point.x] as L.LatLngTuple);
  }, [route]);

  const connectionLines = useMemo(() => {
    if (!roadNodes || !roadConnections) return [];

    const nodeMap: Record<string | number, RoadNode> = {};
    roadNodes.forEach((node) => {
      nodeMap[node.id] = node;
    });

    return roadConnections
      .map((conn) => {
        const fromNode = nodeMap[conn.from];
        const toNode = nodeMap[conn.to];
        if (fromNode && toNode) {
          return [
            [fromNode.y, fromNode.x] as L.LatLngTuple,
            [toNode.y, toNode.x] as L.LatLngTuple,
          ];
        }
        return null;
      })
      .filter((line): line is L.LatLngTuple[] => line !== null);
  }, [roadNodes, roadConnections]);

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
        <MapClickHandler onMapClick={onMapClick} onMapMove={onMapMove} />

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

        {roadNodes &&
          roadNodes.map((node) => (
            <Circle
              key={node.id}
              center={[node.y, node.x] as L.LatLngExpression}
              radius={10}
              pathOptions={{
                color: "#f59e0b",
                fillColor: "#fbbf24",
                fillOpacity: 0.6,
                weight: 2,
              }}
            />
          ))}

        {connectionLines.map((line, index) => (
          <Polyline
            key={`connection-${index}`}
            positions={line}
            pathOptions={{
              color: "#8b5cf6",
              weight: 2,
              opacity: 0.4,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
