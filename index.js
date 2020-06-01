const express = require("express");
const server = express();
server.use(express.json());

// User Info
const shortid = require("shortid");
const sid = shortid.generate;
class User {
  constructor(name, bio) {
    this.id = sid();
    this.name = name;
    this.bio = bio;
  }
}
let users = [
  new User("Brandon", "Born to code."),
  new User("Krista", "I hate my kids."),
];

// Test Endpoint
server.get("/", (req, res) => {
  res.status(200).json({ message: "Server up and running." });
});

// Get an array of users
server.get("/api/users", (req, res) => {
  try {
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});
// Add a new user
server.post("/api/users/", (req, res) => {
  const n = req.body;
  if (n.name && n.bio) {
    try {
      users.push(new User(n.name, n.bio));
      res.status(201).json(users);
    } catch (err) {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
    }
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});
// Return the specified user
server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const filt = users.filter((x) => x.id == id);
  if (filt.length === 0) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    try {
      res.status(200).json(filt[0]);
    } catch (err) {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    }
  }
});
// Update the specified user
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (!data.name && !data.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name or bio for the user." });
  }
  const newUsers = users.map((x) => {
    if (x.id == id) {
      return {
        ...x,
        ...data,
        id: x.id,
      };
    } else {
      return x;
    }
  });
  if (newUsers === users) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    try {
      users = newUsers;
    } catch (err) {
      res.status(500).json({ errorMessage: "The user could not be removed" });
    }
    res.status(200).json(users);
  }
});
// Delete the specified user
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const newUsers = users.filter((x) => x.id != id);
  if (users === newUsers) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    try {
      users = newUsers;
    } catch (err) {
      res.status(500).json({ errorMessage: "The user could not be removed" });
    }
    res.status(200).json(newUsers);
  }
});

const port = 8000;
server.listen(port, () => console.log(`Server up and running on port ${port}`));
