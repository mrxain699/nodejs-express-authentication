const express = require("express");
const cors = require("cors");
const connect = require("./config/connect");
const { auth_routes } = require("./routes/routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);
connect(DATABASE_URI);

app.use(process.env.BASE_API_PATH, auth_routes);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
