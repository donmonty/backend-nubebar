const express = require("express");

const sat = require("./components/sat/network");

const app = express();

app.use(express.json());

// ROUTES
app.use("/api/sat", sat);
app.use("/", (req, res, next) => {
  res.send("Hello world, motherfuckers!");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
