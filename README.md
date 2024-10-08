# badBank
## The bad bank capstone project from the MIT xPRO full stack developer course

This app simulates the basic functionality of a banking app.
- User management including creating new accunts as well as logging in for users who already have an account
- Deposits and withdrawals while always keeping track of your account balance
- Transaction history for every account
- Admin accounts with extra features (making transfers for other users, access every user's data, changing other users' admin status)

All actions are stored in a data base and are persistent. In addition to that you can switch to a light mode if preferred.

___


## Installation

In order to run this app simply follow these steps
1. Clone or copy the code provided here and store it to a directory on your device
2. In case you don't already have, install ***npm*** and ***node*** ( [instructions can be found here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) )
3. Open up a terminal, navigate to the directory you previously chose and run `npm i` to install the required dependencies (in this case ***express***)
4. Remaining in that same directory run `node server.js` to start the server
5. Open a browser application and call `localhost:8080/` to start the banking app

Enjoy!

___


## API documentation  

### GET ALL DATA (api.getAllData)  

**Client request**  

```const response = await fetch("/api.getAllData");```

**Server response**  

```res.send(userData);```

___


### CREATE ACCOUNT (api.createAccount)  

**Client request**  

```
let accountData = {
		name,
		email,
		password
	}
	const options = {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(accountData),
    };
	const response = await fetch("/api.createAccount", options);
```

**Server response**  

```
res.json(parsedUserData.at(-1)); // representing the new user's data set
```

In case of an error the server alternatively sends back a response object containing only the status  
`{ status: "Email already exists." }`

___

### LOG IN (api.logIn)  

**Client request**  

```
let logInData = {
		email,
		password
	}
	const options = {
		method: "POST",
		headers: {
		"Content-Type": "application/json"
		},
		body: JSON.stringify(logInData),
	};
	const response = await fetch("/api.logIn", options);
```

**Server response**  
```
let response = {
          status: "OK",
          content: parsedUserData[index] // representing the requested user data
        }
        res.json(response);
```

In case of an error the server alternatively sends back a response object containing only the status with either  
`{ status: "Email does not exist." }` or `{ status: "Password incorrect." }`  

___

### TRANSACTION (api.transaction)  

**Client request**  
Note that the transaction api is used for both: deposits and withdrawals. The *mode* key in the object carries the relevant information (**1** for deposits and **-1** for withdrawals) and is handled corresondingly.

```
let depositData = {
		email,
		amount,
		mode
	}
	const options = {
		method: "POST",
		headers: {
		"Content-Type": "application/json"
		},
		body: JSON.stringify(depositData),
	};
	const response = await fetch("/api.transaction", options);
```
**Server response**  

```
let response = {
        status: "OK",
        content: parsedUserData[index]
      }
      res.json(response);
```

In case of an error the server alternatively sends back a response object containing only the status with either  
`{ status: "Email does not exist." }` or  
```{ status: `Amount exceeds balance. <br>Maximum possible withdrawal: $ ${parsedUserData[index].balance.toFixed(2)}` }```  

___

### CHANGE ADMIN (api.changeAdmin)  

**Client request**  

```
users[index].admin === true ? users[index].admin = false : users[index].admin = true; // setting the selected user's admin state
				const options = {
					method: "POST",
					headers: {
					"Content-Type": "application/json"
					},
					body: JSON.stringify(users[index]),
				};
				const response = await fetch("/api.changeAdmin", options);
```

**Server response**  

```
let response = {
        status: "OK",
        content: parsedUserData[index]
      }
      res.json(response);
```

___

## Additional features

**Transaction history​**  
Every transaction is permanently saved and can be viewed by the user.​

**Authorization​**  
A user can either be an admin or a client. As an admin you have additional rights to​
- see every user's data including balance and transaction history​
- make transactions (deposits and withdrawals) for other users​
- make other users become an admin, too​

The UI adapts depending on the users role and displays different sets of interactive buttons/inputs.​
​
**Separate data collections** for user data and for credentials as a safety feature.​

**Dark & light mode​**  
Users can choose between a light and a dark mode. The lastly applied mode is stored in a configuration file in the browser's local storage. This ensures that the selected mode is already applied before logging in.​

**Color scheme​**  
Each functionality has its unique color accent that is represented in the navigation bar and in each ​
corresponding card for easy navigation.
