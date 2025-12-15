export type Point = {
  x: number;
  y: number;
};

export type RoutePoint = {
  x: number;
  y: number;
};

export type RoadNode = {
  id: string;
  area_id: number;
  node_id: number;
  x: number;
  y: number;
  z: number;
};

export type Connection = {
  from: string;
  to: string;
};
