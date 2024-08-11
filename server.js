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

const cyphers = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","^","!","§","$","%","&","/", "(", ")","=","?","*","+","#","{","}","[","]","<",">",",",".","-",";",":"];

const randomCyphers = () => {
	let randomString = "";
	for (i = 0; i < 10; i++) {
		randomString += cyphers[Math.floor(Math.random() * cyphers.length)];
	}
	return randomString;
}

app.post('/api.createAccount', (req, res) => {
  const data = req.body;
  fs.readFile("./userData.json", "utf8", (err, userData) => {
    if (err) throw err;
    let parsedUserData = JSON.parse(userData);
    let emails = [];
    parsedUserData.forEach(e => {
      emails.push(e.email);
    });
    if (emails.find((element) => element === data.email)) {
      res.json({ status: "Email already exists." });
      return;
    }
    let newUser = {
      id: `user_${Date.now()}_${randomCyphers()}`,
      name: data.name,
      email: data.email,
      admin: false,
      balance: 0,
      transactions: []
    }
    parsedUserData.push(newUser);
    let userDataString = JSON.stringify(parsedUserData);
    fs.writeFile("./userData.json", userDataString, (err) => {
      if (err) throw err;
      res.json(parsedUserData.at(-1));
    });
  });
  fs.readFile("./credentials.json", "utf8", (err, credentials) => {
    if (err) throw err;
    let parsedCredentials = JSON.parse(credentials);
    let newUserCredentials = {
      id: data.id,
      password: data.password
    };
    parsedCredentials.push(newUserCredentials);
    let credentialsString = JSON.stringify(parsedCredentials);
    fs.writeFile("./credentials.json", credentialsString, (err) => {
      if (err) throw err;
    })
  })
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

    fs.readFile("./credentials.json", "utf8", (err, credentials) => {
      if (err) throw err;
      let parsedCredentials = JSON.parse(credentials);
      let ids = [];
      parsedCredentials.forEach(e => {
        ids.push(e.id);
      });
      let index2 = ids.indexOf(parsedUserData[index].id);
      if (index === -1) {
        let response = { status: "Email does not exist." };
        res.json(response);
      } else if (parsedUserData[index].email === data.email && parsedCredentials[index2].password === data.password) {
        let response = {
          status: "OK",
          content: parsedUserData[index]
        }
        res.json(response);
      } else if (parsedUserData[index].email === data.email && parsedCredentials[index2] != data.password) {
        let response = { status: "Password incorrect." };
        res.json(response);
      }
    });
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
      let response = { status: "Email does not exist." };
      res.json(response);
      return;
    } else if (data.mode === -1 && data.amount > parsedUserData[index].balance) {
      let response = { status: `Amount exceeds balance. <br>Maximum possible withdrawal: $ ${parsedUserData[index].balance.toFixed(2)}` }
      res.json(response);
      return;
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

app.listen(8080, () => console.log('listening at 8080'));