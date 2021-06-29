const express = require("express");
const dotenv = require("dotenv");
const corsConfig = require("./middlewares/corsConfig");
const indexRoutes = require("./routes/rootRouter");
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


