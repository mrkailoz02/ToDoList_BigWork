const partModel = {
  getAllParts: async (client: any, conditions: string) => {
    const sql = `SELECT * FROM md.part ${conditions ? `WHERE ${conditions}` : ""}`;
    return await client.query(sql);
  },
};

export default partModel;

