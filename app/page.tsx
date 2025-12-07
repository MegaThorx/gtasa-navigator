"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  MapMarker,
  RoutePoint,
  RoadNode,
  RoadConnection,
} from "@/components/map";
import { Sidebar } from "@/components/sidebar";
import { read } from "@/lib/neo4j";
import { CoordinatePicker } from "@/components/coordinate-picker";
import { Button } from "@/components/ui/button";
import { RecordShape } from "neo4j-driver-core/types/record";
import { Label } from "@/components/ui/label";
import {
  Car,
  IconNode,
  LucideIcon,
  PersonStanding,
  Route,
  Ship,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [roadNodes, setRoadNodes] = useState<RoadNode[]>([]);
  const [roadConnections, setRoadConnections] = useState<RoadConnection[]>([]);
  const [showingNodes, setShowingNodes] = useState(false);
  const [mode, setMode] = useState<"Car" | "Boat" | "Ped">("Car");
  const [avoidHighways, setAvoidHighways] = useState(false);

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

  const handleMapMove = useCallback((center: { x: number; y: number }) => {
    setMapCenter(center);
  }, []);

  const calculateRoute = async () => {
    const apiResponse = await read(
      `MATCH (startNode:PathNode {type: "${mode}"${mode === "Car" ? (avoidHighways ? ", is_highway: false" : "") : ""}})
     WITH startNode,
          (startNode.x - ${origin?.x})^2 + (startNode.y - ${origin?.y})^2 + (startNode.z)^2 AS startDistanceSq
     ORDER BY startDistanceSq
     LIMIT 1
     MATCH (endNode:PathNode {type: "${mode}"${mode === "Car" ? (avoidHighways ? ", is_highway: false" : "") : ""}})
     WITH startNode, endNode,
          (endNode.x - ${destination?.x})^2 + (endNode.y - ${destination?.y})^2 + (endNode.z)^2 AS endDistanceSq
     ORDER BY endDistanceSq
     LIMIT 1
     MATCH p=shortestPath((startNode)-[${mode === "Car" ? (avoidHighways ? ":NOT_HIGHWAY" : ":CONNECTS_TO") : ":CONNECTS_TO"}*1..1000]->(endNode))
     RETURN p`,
    );

    const response = JSON.parse(apiResponse) as RecordShape[];
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

  const visualizeNodes = async () => {
    const halfRange = 1000;

    const nodesQuery = `
      MATCH (n:PathNode)
      WHERE n.x >= ${mapCenter.x - halfRange} AND n.x <= ${mapCenter.x + halfRange}
        AND n.y >= ${mapCenter.y - halfRange} AND n.y <= ${mapCenter.y + halfRange}
      RETURN n.nodeId as id, n.x as x, n.y as y, n.z as z
    `;

    const nodesResponse = await read(nodesQuery);
    const nodes = JSON.parse(nodesResponse) as RoadNode[];

    if (nodes.length === 0) {
      alert("No nodes found in this area");
      return;
    }

    const nodeIds = nodes.map((n) => n.id);

    const connectionsQuery = `
      MATCH (n1:PathNode)-[r]->(n2:PathNode)
      WHERE n1.nodeId IN [${nodeIds.join(",")}]
        AND n2.nodeId IN [${nodeIds.join(",")}]
      RETURN n1.nodeId as from, n2.nodeId as to
    `;

    console.log(nodeIds);
    console.log(nodesQuery);
    console.log(connectionsQuery);

    const connectionsResponse = await read(connectionsQuery);
    const connections = JSON.parse(connectionsResponse) as RoadConnection[];

    setRoadNodes(nodes);
    setRoadConnections(connections);
    setShowingNodes(true);
  };

  const clearNodes = () => {
    setRoadNodes([]);
    setRoadConnections([]);
    setShowingNodes(false);
  };

  const modes: {
    label: string;
    value: "Car" | "Boat" | "Ped";
    icon: LucideIcon;
  }[] = [
    { label: "Car", value: "Car", icon: Car },
    { label: "Boat", value: "Boat", icon: Ship },
    { label: "Foot", value: "Ped", icon: PersonStanding },
  ];

  return (
    <div className="h-screen w-full bg-slate-900 flex overflow-hidden relative">
      <Sidebar>
        <div>
          <Label className="text-slate-300 mb-3 block text-sm font-semibold">
            Transportation Mode
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={cn(
                    "flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all",
                    mode === m.id
                      ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 mb-2",
                      mode === m.value ? "text-blue-400" : "text-slate-400",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      mode === m.value ? "text-white" : "text-slate-400",
                    )}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {mode === "Car" && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Route className="w-5 h-5 text-amber-400" />
                  <div>
                    <Label className="text-slate-200 text-sm font-semibold">
                      Avoid Highways
                    </Label>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Use local roads only
                    </p>
                  </div>
                </div>
                <Switch
                  checked={avoidHighways}
                  onCheckedChange={setAvoidHighways}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <CoordinatePicker
          origin={origin}
          destination={destination}
          onSetOriginClick={() => setClickMode("origin")}
          onSetDestinationClick={() => setClickMode("destination")}
        />
        <Button variant="secondary" onClick={calculateRoute}>
          Calculate route
        </Button>
        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">
            View nodes in 200x200 area
          </p>
          <p className="text-xs text-slate-500 mb-3">
            Center: ({mapCenter.x.toFixed(0)}, {mapCenter.y.toFixed(0)})
          </p>
          {!showingNodes ? (
            <Button
              variant="outline"
              onClick={visualizeNodes}
              className="w-full"
            >
              Show Nodes
            </Button>
          ) : (
            <div className="space-y-2">
              <Button variant="outline" onClick={clearNodes} className="w-full">
                Hide Nodes
              </Button>
              <p className="text-xs text-slate-300">
                Showing {roadNodes.length} nodes and {roadConnections.length}{" "}
                connections
              </p>
            </div>
          )}
        </div>
      </Sidebar>
      <div className="flex-1 relative">
        <Map
          onMapClickAction={handleMapClick}
          onMapMoveAction={handleMapMove}
          markers={markers}
          route={route}
          roadNodes={roadNodes}
          roadConnections={roadConnections}
        />
      </div>
    </div>
  );
}
