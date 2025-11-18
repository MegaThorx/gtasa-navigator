"use server";

import neo4j from "neo4j-driver";
import { Query } from "neo4j-driver-core/types/types";

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

const driver = neo4j.driver(
  NEO4J_URI ?? "",
  neo4j.auth.basic(NEO4J_USERNAME ?? "", NEO4J_PASSWORD ?? ""),
);

export async function read(cypher: Query, params = {}) {
  const session = driver.session();

  try {
    const res = await session.executeRead((tx) => tx.run(cypher, params));

    const values = res.records.map((record) => record.toObject());

    return JSON.stringify(values);
  } finally {
    await session.close();
  }
}
