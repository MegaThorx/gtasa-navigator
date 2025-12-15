"use server";

import neo4j, { RecordShape } from "neo4j-driver";
import { Query } from "neo4j-driver-core/types/types";
import { Connection, Point, RoadNode, RoutePoint } from "@/lib/types";

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

const driver = neo4j.driver(
  NEO4J_URI ?? "",
  neo4j.auth.basic(NEO4J_USERNAME ?? "", NEO4J_PASSWORD ?? ""),
  { disableLosslessIntegers: true },
);

async function read(cypher: Query, params = {}): Promise<RecordShape[]> {
  const session = driver.session();

  try {
    console.log(cypher);
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    const values = res.records.map((record) => record.toObject());

    return values;
  } finally {
    await session.close();
  }
}

export async function findRoute(
  origin: Point,
  destination: Point,
  mode: "Car" | "Boat" | "Ped",
  avoidHighways: boolean,
): Promise<RoutePoint[]> {
  const response = await read(
    `MATCH (startNode:PathNode {type: "${mode}"${mode === "Car" ? (avoidHighways ? ", is_highway: false" : "") : ""}})
   WITH startNode,
        (startNode.x - ${origin.x})^2 + (startNode.y - ${origin.y})^2 AS startDistanceSq
   ORDER BY startDistanceSq
   LIMIT 1
   MATCH (endNode:PathNode {type: "${mode}"${mode === "Car" ? (avoidHighways ? ", is_highway: false" : "") : ""}})
   WITH startNode, endNode,
        (endNode.x - ${destination.x})^2 + (endNode.y - ${destination.y})^2 AS endDistanceSq
   ORDER BY endDistanceSq
   LIMIT 1
   MATCH p=shortestPath((startNode)-[${mode === "Car" ? (avoidHighways ? ":NOT_HIGHWAY" : ":CONNECTS_TO") : ":CONNECTS_TO"}*1..1000]->(endNode))
   RETURN p`,
  );

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

  return newRoute;
}

export async function showNodesWithin(
  leftUpperBound: Point,
  rightLowerBound: Point,
): Promise<{
  nodes: RoadNode[];
  connections: Connection[];
}> {
  const nodesQuery = `
    MATCH (n:PathNode)
    WHERE n.x >= ${leftUpperBound.x} AND n.x <= ${rightLowerBound.x}
      AND n.y >= ${leftUpperBound.y} AND n.y <= ${rightLowerBound.y}
    RETURN elementId(n) as id, n.area_id as area_id, n.node_id as node_id, n.x as x, n.y as y, n.z as z
  `;
  const nodes = (await read(nodesQuery)) as RoadNode[];
  const nodeIds = nodes.map((node) => node.id);

  const connectionsQuery = `
    MATCH (n1:PathNode)-[r]->(n2:PathNode)
    WHERE elementId(n1) IN ['${nodeIds.join("','")}']
      AND elementId(n2) IN ['${nodeIds.join("','")}']
    RETURN elementId(n1) as from, elementId(n2) as to
  `;

  const connections = (await read(connectionsQuery)) as Connection[];

  return {
    nodes: nodes,
    connections: connections,
  };
}
