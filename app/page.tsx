"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapMarker, RoutePoint } from "@/components/map";
import { Sidebar } from "@/components/sidebar";
import { read } from "@/lib/neo4j";
import { CoordinatePicker } from "@/components/coordinate-picker";
import { Button } from "@/components/ui/button";

const Map = dynamic(
  () => import("@/components/map").then((mod) => ({ default: mod.Map })),
  { ssr: false },
);

export default function Home() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [destination, setDestination] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [clickMode, setClickMode] = useState<"origin" | "destination" | null>(
    null,
  );

  const handleMapClick = (x: number, y: number) => {
    if (clickMode === "origin") {
      setOrigin({ x, y });
      setClickMode("destination");
      setMarkers([
        ...markers.filter((marker) => marker.type !== "origin"),
        { id: "origin", type: "origin", x, y },
      ]);
    } else if (clickMode === "destination") {
      setDestination({ x, y });
      setClickMode(null);
      setMarkers([
        ...markers.filter((marker) => marker.type !== "destination"),
        { id: "destination", type: "destination", x, y },
      ]);
    }
  };

  const calculateRoute = async () => {
    let apiResponse = await read(
      `MATCH (startNode:Road)
     WITH startNode,
          (startNode.x - ${origin?.x})^2 + (startNode.y - ${origin?.y})^2 + (startNode.z)^2 AS startDistanceSq
     ORDER BY startDistanceSq
     LIMIT 1
     MATCH (endNode:Road)
     WITH startNode, endNode,
          (endNode.x - ${destination?.x})^2 + (endNode.y - ${destination?.y})^2 + (endNode.z)^2 AS endDistanceSq
     ORDER BY endDistanceSq
     LIMIT 1
     MATCH p=shortestPath((startNode)-[*]->(endNode))
     RETURN p`,
    );

    let response = JSON.parse(apiResponse) as any[];
    console.log(response);

    const newRoute = [];
    newRoute.push({
      x: response[0].p.start.properties.x,
      y: response[0].p.start.properties.y,
    });

    for (const segment of response[0].p.segments) {
      newRoute.push({
        x: segment.start.properties.x,
        y: segment.start.properties.y,
      });
      newRoute.push({
        x: segment.end.properties.x,
        y: segment.end.properties.y,
      });
    }

    newRoute.push({
      x: response[0].p.end.properties.x,
      y: response[0].p.end.properties.y,
    });

    setRoute(newRoute);
  };

  return (
    <div className="h-screen w-full bg-slate-900 flex overflow-hidden relative">
      <Sidebar>
        <CoordinatePicker
          origin={origin}
          destination={destination}
          onSetOriginClick={() => setClickMode("origin")}
          onSetDestinationClick={() => setClickMode("destination")}
        />
        <Button variant="secondary" onClick={calculateRoute}>
          Calculate route
        </Button>
      </Sidebar>
      <div className="flex-1 relative">
        <Map onMapClick={handleMapClick} markers={markers} route={route} />
      </div>
    </div>
  );
}
