import { zodiosContext } from "@zodios/express";
import { openApiBuilder } from "@zodios/openapi";
import { serve, setup } from "swagger-ui-express";
import { getNFTData } from "./getNFTData";
import { nftDataApi } from "./nftDataApi";

const ctx = zodiosContext();
const PORT = 3400;

const app = ctx.app(nftDataApi);

app.get("/nft-data/:txHash", async (req, res) => {
  try {
    const { nftAddress, owner } = await getNFTData(req.params.txHash);

    if (!nftAddress || !owner) {
      res.status(404).send({ message: "NFT data not found" });
      return;
    }

    res.json({ nftAddress, owner });
  } catch (error) {
    console.log(error, JSON.stringify(error, null, 2));

    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

const document = openApiBuilder({
  title: "User API",
  version: "1.0.0",
  description: "A simple user API",
})
  // you can declare as many security servers as you want
  .addServer({ url: "/" })
  // you can declare as many apis as you want
  .addPublicApi(nftDataApi)
  // you can declare as many protected apis as you want
  .build();

app.use(`/docs/swagger.json`, (_, res) => res.json(document));
app.use("/", serve);
app.use("/", setup(undefined, { swaggerUrl: "/docs/swagger.json" }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
