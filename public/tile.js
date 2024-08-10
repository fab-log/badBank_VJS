const tileHeader = document.querySelector("#tile-header");
const tileInfo = document.querySelector("#tile-info");
const tileContent = document.querySelector("#tile-content");
const tileDetails = document.querySelector("#tile-details");
const liHome = document.querySelector("#liHome");
const liCreateAccount = document.querySelector("#liCreateAccount");
const liLogIn = document.querySelector("#liLogIn");
const liLogOut = document.querySelector("#liLogOut");
const liDeposit = document.querySelector("#liDeposit");
const liWithdraw = document.querySelector("#liWithdraw");
const liTransactions = document.querySelector("#liTransactions");
const liAllData = document.querySelector("#liAllData");

let loggedInUser = {};

const cyphers = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","^","!","§","$","%","&","/", "(", ")","=","?","*","+","#","{","}","[","]","<",">",",",".","-",";",":"];

const randomCyphers = () => {
	let randomString = "";
	for (i = 0; i < 10; i++) {
		randomString += cyphers[Math.floor(Math.random() * cyphers.length)];
	}
	return randomString;
}

const dateToString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return "";
    } else {
        let year = new Date(jsTimestamp).getFullYear();
        let month = new Date(jsTimestamp).getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = new Date(jsTimestamp).getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hour = new Date(jsTimestamp).getHours();
        if (hour < 10) {
            hour = `0${hour}`;
        }
        let minute = new Date(jsTimestamp).getMinutes();
        if (minute < 10) {
            minute = `0${minute}`;
        }
        return `${year}/${month}/${day} - ${hour}:${minute}`;
    }
};

const showAlert = (text) => {
	const alert = document.querySelector(".alert");
	alert.style.display = "block";
	alert.innerHTML = `<p>${text}</p>`;
	setTimeout(() => {
		alert.innerHTML = "";
		alert.style.display = "none";
	}, 3000);
};

const showFunctions = () => {
	liCreateAccount.style.display = "none"
	liLogIn.style.display = "none";
	liLogOut.style.display = "block";
	liDeposit.style.display = "block";
	liWithdraw.style.display = "block";
	liTransactions.style.display = "block";
	// liAllData.style.display = "block";
}

const hideFunctions = () => {
	liCreateAccount.style.display = "block"
	liLogIn.style.display = "block";
	liLogOut.style.display = "none";
	liDeposit.style.display = "none";
	liWithdraw.style.display = "none";
	liTransactions.style.display = "none";
	liAllData.style.display = "none";
}

let quicklog = (info, user) => {	
	let item = {
		name: user.name,
		email: user.email,
		balance: "$ " + user.balance.toFixed(2)
	}
	if (user.transactions.length > 0) {
		let mode;
		user.transactions.at(-1)[1] === 1 ? mode = "deposit" : mode = "withdraw";
		item.last_transaction = {
			date: dateToString(user.transactions.at(-1)[0]),
			mode,
			amount: "$ " + user.transactions.at(-1)[2].toFixed(2)
		}
	}
	console.log(info + JSON.stringify(item, null, 2));
}	

const createAccount = async (event) => {
	event.preventDefault();
	let name = document.querySelector("#name").value;
	let email = document.querySelector("#email").value;
	let	password = document.querySelector("#password").value;
	let	confirmPassword = document.querySelector("#confirmPassword").value;

	if (name === "" || email === "" || password == "") {
		showAlert("Please fill all fields");
		return;
	}
	if (password.length < 8) {
		showAlert("Password must have a minimum length of 8 characters");
		return;
	}
	if (password != confirmPassword) {
		showAlert("Passwords do not match!");
		return;
	}

	let accountData = {
		id: `user_${Date.now()}_${randomCyphers()}`,
		name,
		email,
		password,
		admin: false,
		balance: 0,
		transactions: []
	}
	const options = {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(accountData),
    };
	const response = await fetch("/api.createAccount", options);
  	loggedInUser = await response.json();
	

	tileContent.innerHTML = `
		<h4>Success!</h4>
		<p>You are now logged in as ${loggedInUser.email}</p>
		<hr class="yellow">
		<button type="submit" onclick="showCreateAccount()">Create another account</button>
	`;
	showFunctions();
}

const logIn = async (event) => {
	event.preventDefault();
	let email = document.querySelector("#email").value;
	let	password = document.querySelector("#password").value;
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
	let data = await response.json();
	let status = data.status;
	// let html = data.html;
	if (status === "OK") {
		loggedInUser = data.content;
		quicklog("Logged in user: ", loggedInUser);
		tileHeader.innerHTML = `
			<h2>Logged in</h2>
			<hr class="purple">
		`;
		let suffix = "";
		if (loggedInUser.admin === true) { suffix = " (admin)" }
		tileInfo.innerHTML = `
			<p>You are logged in as <b>${loggedInUser.email}</b>${suffix}</p>
			<p>Your current balance: <b>$ ${loggedInUser.balance.toFixed(2)}</b></p>
			<hr>
		`;
		tileContent.innerHTML = "";
		showFunctions();
	} else {
		tileInfo.innerHTML = `
			<h4>Error!</h4>
			<p>${status}</p>
			<p>Please try again</p>
			<hr>
		`
	}
}

const logOut = () => {
	window.location.reload();
}

const transaction = async (event, mode) => {
	event.preventDefault();
	let email = "";
	let suffix = "";
	if (loggedInUser.admin === true) {
		email = document.querySelector("#email").value;
		suffix = `. (Account: ${email})`
	} else {
		email = loggedInUser.email
	}	
	const amount = Number(document.querySelector("#amount").value);
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
	let data = await response.json();
	let status = data.status;
	if (status === "OK" && email === loggedInUser.email) {
		loggedInUser = data.content;
		quicklog("User data after transaction completed: ", loggedInUser);
		tileInfo.innerHTML = `
			<p>You are logged in as <b>${loggedInUser.email}</b></p>
			<p>Your current balance: <b>$ ${loggedInUser.balance.toFixed(2)}</b></p>
			<hr>
		`;
		if (mode === 1) {
			tileContent.innerHTML = `
				<p>You have successfully deposited $ ${amount.toFixed(2)} to your account.</p>
				<hr class="grey">
				<button type="submit" onclick="showDeposit()">Deposit again</button>
			`;
		} else {
			tileContent.innerHTML = `
				<p>You have successfully withdrawn $ ${amount.toFixed(2)} from your account.</p>
				<hr class="grey">
				<button type="submit" onclick="showWithdraw()">Withdraw again</button>
			`;
		}
		// showFunctions();
	} else if (status === "OK" && email != loggedInUser.email) {
		user = data.content;
		quicklog("User data after transaction completed: ", user);
		tileInfo.innerHTML = `
			<p>You are logged in as <b>${loggedInUser.email}</b></p>
			<p>Your current balance: <b>$ ${loggedInUser.balance.toFixed(2)}</b></p>
			<hr>
		`;
		if (mode === 1) {
			tileContent.innerHTML = `
				<p>You have successfully deposited $ ${amount.toFixed(2)} to ${user.name}'s account. (Admin transaction)</p>
				<p>New balance: <b>$ ${user.balance.toFixed(2)}</b></p>
				<hr class="grey">
				<button type="submit" onclick="showDeposit()">Deposit again</button>
			`;
		} else {
			tileContent.innerHTML = `
				<p>You have successfully withdrawn $ ${amount.toFixed(2)} from ${user.name}'s account. (Admin transaction)</p>
				<p>New balance: <b>$ ${user.balance.toFixed(2)}</b></p>
				<hr class="grey">
				<button type="submit" onclick="showWithdraw()">Withdraw again</button>
			`;
		}
		// showFunctions();
	} else {
		tileInfo.innerHTML = `
			<h4>Error!</h4>
			<p>${status}</p>
			<p>Please try again</p>
			<hr>
		`
	}
}

const showHome = () => {
	tileInfo.innerHTML = "";
	tileContent.innerHTML = "";
	tileDetails.innerHTML = "";
	tileHeader.innerHTML = `
		<h2>Bad Bank</h2>
		<hr class="grey-bold">
	`;
	if (Object.keys(loggedInUser).length === 0) {
		tileInfo.innerHTML = "";
	} else {
		let suffix = "";
		if (loggedInUser.admin === true) { suffix = " (admin)" }
		tileInfo.innerHTML = `
			<p>You are logged in as <b>${loggedInUser.email}</b>${suffix}</p>
			<p>Your current balance: <b>$ ${loggedInUser.balance.toFixed(2)}</b></p>
			<hr>
		`;
	}
	tileContent.innerHTML = `
		<img src="pix/bank_sos_rainbow.png" alt="image bank">
		<hr class="grey">
		<p>Welcome to the world's worst bank.</p>
		<p>Don't trust anybody here and never deploy any sensitive data. Please use fake emails only.</p>
	`;
}

const showCreateAccount = () => {
	tileInfo.innerHTML = "";
	tileDetails.innerHTML = "";
	tileHeader.innerHTML = `
		<h2>Create account</h2>
		<hr class="yellow">
	`;
	tileContent.innerHTML = `
		<form>
			<input type="text" id="name" placeholder="full name"><br>
			<input type="email" id="email" placeholder="email"><br>
			<input type="password" id="password" placeholder="password"><br>
			<input type="password" id="confirmPassword" placeholder="confirm password">
			<hr class="grey">
			<button type="submit" onclick="createAccount(event)">Create account</button>
		</form>
	`;
}

const showLogIn = () => {
	tileInfo.innerHTML = "";
	tileDetails.innerHTML = "";
	tileHeader.innerHTML = `
		<h2>Log in</h2>
		<hr class="purple">
	`;
	tileContent.innerHTML = `
		<form>
			<input type="email" id="email" placeholder="email"><br>
			<input type="password" id="password" placeholder="password"><br>
			<hr class="grey">
			<button type="submit" onclick="logIn(event)">Log in</button>
		</form>
	`;
}

const showDeposit = () => {
	tileContent.innerHTML = "";
	tileDetails.innerHTML = "";
	tileHeader.innerHTML = `
		<h2>Deposit</h2>
		<hr class="green">
	`;
	let suffix = "";
	if (loggedInUser.admin === true) { suffix = " (admin)" }
	tileInfo.innerHTML = `
		<p>You are logged in as <b>${loggedInUser.email}</b>${suffix}</p>
		<p>Your current balance: <b>$ ${loggedInUser.balance.toFixed(2)}</b></p>
		<hr>
	`;
	if (loggedInUser.admin === true) {
		tileContent.innerHTML = `
			<p>As an admin you can execute transactions for any clients' account. Deploy their email for identification.</p>
			<input type="email" id="email" placeholder="email"><br>
		`;
	}
	tileContent.innerHTML += `
		<form>
			<input type="number" id="amount" placeholder="amount" min="1" max="1000000"><br>
			<hr class="grey">
			<button type="submit" onclick="transaction(event, 1)">Deposit</button>
		</form>
	`;
}

const showWithdraw = () => {
	tileContent.innerHTML = "";
	tileDetails.innerHTML = "";
	tileHeader.innerHTML = `
		<h2>Withdraw</h2>
		<hr class="red">
	`;
	let suffix = "";
	if (loggedInUser.admin === true) { suffix = " (admin)" }
	tileInfo.innerHTML = `
		<p>You are logged in as <b>${loggedInUser.email}</b>${suffix}</p>
		<p>Your current balance: <b>$ ${loggedInUser.balance.toFixed(2)}</b></p>
		<hr>
	`;
	if (loggedInUser.admin === true) {
		tileContent.innerHTML = `
			<p>As an admin you can execute transactions for any clients' account. Deploy their email for identification.</p>
			<input type="email" id="email" placeholder="email"><br>
		`;
	}
	tileContent.innerHTML += `
		<form>
			<input type="number" id="amount" placeholder="amount" min="1" max="1000000"><br>
			<hr class="grey">
			<button type="submit" onclick="transaction(event, -1)">Withdraw</button>
		</form>
	`;
}

const showTransactions = async () => {
	let mode;
	let color;
	tileHeader.innerHTML = `
		<h2>Transactions</h2>
		<hr class="blue">
	`;
	if (loggedInUser.admin === false) {
		tileInfo.innerHTML = `
			<p>You are logged in as <b>${loggedInUser.email}</b></p>
			<p>Your current balance: <b>$ ${loggedInUser.balance.toFixed(2)}</b></p>
			<hr>
		`;
		tileContent.innerHTML = "";
		loggedInUser.transactions.forEach(e => {
			e[1] === 1 ? mode = "Deposit" : mode = "Withdrawal";
			e[1] === 1 ? color = "var(--acc-green)" : color = "var(--acc-red)";
			tileContent.insertAdjacentHTML("afterbegin", `
					<div class="element">
						<p style="color: ${color};">${dateToString(e[0])}<br>
						${mode}: $ <b>${e[2].toFixed(2)}</b></p>
					</div>
				`)
		});
	} else {
		const response = await fetch("/api.getAllData");
		let users = await response.json();
		tileContent.innerHTML = "";
		let dropDown = "";
		users.forEach(e => {
			dropDown += `<option value=${e.email}>${e.name} (${e.email})</option>`;
		});

		tileContent.innerHTML = `
			<select id="selAccount">
				<option value="" selected disabled>Please select an account</option>
				${dropDown}
			</select>
		`;

		let selAccount = document.querySelector("#selAccount");
		selAccount.addEventListener("change", () => {
			tileDetails.innerHTML = "";

			let emails = [];
			users.forEach(e => {
				emails.push(e.email);
			});
			let index = emails.indexOf(selAccount.value);
			users[index].transactions.forEach(e => {
				e[1] === 1 ? mode = "Deposit" : mode = "Withdrawal";
				e[1] === 1 ? color = "var(--acc-green)" : color = "var(--acc-red)";
				tileDetails.insertAdjacentHTML("afterbegin", `
					<div class="element">
						<p style="color: ${color};">${dateToString(e[0])}<br>
						${mode}: $ <b>${e[2].toFixed(2)}</b></p>
					</div>
				`);
			});
			// ${(users[index].email).toString()}
			tileDetails.insertAdjacentHTML("afterbegin", `
				<p>Change ${users[index].name}'s admin rights</p>
				<button type="submit" id="btnChangeAdmin">Change admin rights</button><br><br><br>
				<hr>
				`)
			tileDetails.insertAdjacentHTML("afterbegin", `
				<h4>Selected account</h4>
				<ul>
					<li>Name: ${users[index].name}</li>
					<li>Email: ${users[index].email}</li>
					<li>ID: ${users[index].id}</li>
					<li>Admin: ${users[index].admin}</li>
					<li>Balance: $ ${users[index].balance.toFixed(2)}</li>
				</ul>
				<hr class="grey">
			`);
			const btnChangeAdmin = document.querySelector("#btnChangeAdmin");
			btnChangeAdmin.addEventListener("click", async () => {
				users[index].admin === true ? users[index].admin = false : users[index].admin = true;
				const options = {
					method: "POST",
					headers: {
					"Content-Type": "application/json"
					},
					body: JSON.stringify(users[index]),
				};
				const response = await fetch("/api.changeAdmin", options);
				let data = await response.json();
				if (data.status === "OK") {
					let role = "";
					data.content.admin === true ? role = "Admin" : role = "Client";
					tileDetails.innerHTML = `
						<p>Role successfully changed. New role: ${role}</p>
					`;
				}
			});
		})
	}
}

showHome();
hideFunctions();