import express from "express";
import { z } from "zod";
import { getNFTData } from "./getNFTData";

const PORT = process.env.PORT || 3400;

const app = express();

// eg: http://localhost:3000/nft-data/{txHash}
app.get("/nft-data/:txHash", async (req, res) => {
  const query = z
    .object({
      txHash: z.string(),
    })
    .parse(req.params);

  const result = await getNFTData(query.txHash);

  res.json(result);
});

// app.use("/", swaggerUi.serve);
// app.get("/", swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
