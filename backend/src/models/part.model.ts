export const PartModel = {
  getAllParts: async (client: any, conditions: string) => {
    const sql = `SELECT * FROM md.part ${conditions ? `WHERE ${conditions}` : ""}`;
    return await client.query(sql);
  },
};
