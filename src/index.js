require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 3000;
const users = ["User00", "User01", "User02"];
const app = express();
const checkNameIsSet = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
};
const checkUserInArray = (req, res, next) => {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }
  req.user = user;
  return next();
};

app.use(express.json());
app.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

app.get("/users", (req, res) => {
  return res.json(users);
});
app.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json({ message: `Buscando o usuário ${req.user}` });
});
app.post("/users", checkNameIsSet, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});
app.put("/users/:index", checkUserInArray, checkNameIsSet, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});
app.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
