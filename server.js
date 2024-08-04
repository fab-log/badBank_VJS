const express = require('express');
const fs = require("fs");

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get("/api.getAllData", (req, res) => {
  fs.readFile("./userData.json", "utf8", (err, userData) => {
    if (err) throw err;
    res.send(userData);
  })
});

app.post('/api.createAccount', (req, res) => {
  const data = req.body;
  console.log({ data });
  fs.readFile("./userData.json", "utf8", (err, userData) => {
    if (err) throw err;
    let parsedUserData = JSON.parse(userData);
    let emails = [];
    parsedUserData.forEach(e => {
      emails.push(e.email);
    });
    if (emails.find((element) => element === data.email)) {
      console.log("error: email already exists");
      res.json({ status: "Email already exists." });
      return;
    }

    parsedUserData.push(data);
    let userDataString = JSON.stringify(parsedUserData);
    fs.writeFile("./userData.json", userDataString, (err) => {
      if (err) throw err;
      console.log({ parsedUserData });
      res.json(parsedUserData.at(-1));
    });
  });
});

app.post('/api.logIn', (req, res) => {
  const data = req.body;
  fs.readFile("./userData.json", "utf8", (err, userData) => {
    if (err) throw err;
    let parsedUserData = JSON.parse(userData);
    let emails = [];
    parsedUserData.forEach(e => {
      emails.push(e.email);
    });
    let index = emails.indexOf(data.email);
    if (index === -1) {
      let response = { status: "Email does not exist." };
      res.json(response);
    } else if (parsedUserData[index].email === data.email && parsedUserData[index].password === data.password) {
      let response = {
        status: "OK",
        content: parsedUserData[index]
      }
      res.json(response);
    } else if (parsedUserData[index].email === data.email && parsedUserData[index].password != data.password) {
      let response = { status: "Password incorrect." };
      res.json(response);
    }
  });
});

app.post('/api.transaction', (req, res) => {
  const data = req.body;
  fs.readFile("./userData.json", "utf8", (err, userData) => {
    if (err) throw err;
    let parsedUserData = JSON.parse(userData);
    let emails = [];
    parsedUserData.forEach(e => {
      emails.push(e.email);
    });
    let index = emails.indexOf(data.email);
    if (index === -1) {
      let response = { status: "Email does not exist" };
      res.json(response);
    } else {
      parsedUserData[index].balance += data.amount * data.mode;
      parsedUserData[index].transactions.push([
        Date.now(),
        data.mode,
        data.amount
      ])
      let userDataString = JSON.stringify(parsedUserData);
      fs.writeFile("./userData.json", userDataString, (err) => {
        if (err) throw err;
      });
      let response = {
        status: "OK",
        content: parsedUserData[index]
      }
      res.json(response);
    }
  })
});

app.post('/api.changeAdmin', (req, res) => {
  const data = req.body;
  fs.readFile("./userData.json", "utf8", (err, userData) => {
    if (err) throw err;
    let parsedUserData = JSON.parse(userData);
    let emails = [];
    parsedUserData.forEach(e => {
      emails.push(e.email);
    });
    let index = emails.indexOf(data.email);
      parsedUserData[index].admin = data.admin;      
      let userDataString = JSON.stringify(parsedUserData);
      fs.writeFile("./userData.json", userDataString, (err) => {
        if (err) throw err;
      });
      let response = {
        status: "OK",
        content: parsedUserData[index]
      }
      res.json(response);
  })
});

app.listen(3000, () => console.log('listening at 3000'));