import express  from "express";
import dotenv  from "dotenv";
import corsConfig  from "./middlewares/corsConfig.js";
import indexRoutes  from "./routes/rootRouter.js";
dotenv.config();
const PORT = process.env.PORT || 5500;
// init express
const app = express();
app.use(corsConfig)
app.use(express.json());

app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});


