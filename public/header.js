const header = document.querySelector("#header");

header.innerHTML = `
	<ul>
		<li style="border-bottom: 4px solid var(--grey);" id="liHome" onclick="showHome()"><img src="pix/bank.png" alt="bank logo">Bad Bank</li>
		<li style="border-bottom: 4px solid var(--acc-yellow);" id="liCreateAccount" onclick="showCreateAccount()">Create account</li>
		<li style="border-bottom: 4px solid var(--acc-purple);" id="liLogIn" onclick="showLogIn()">Log in</li>
		<li style="border-bottom: 4px solid var(--acc-purple);" id="liLogOut" onclick="logOut()">Log out</li>
		<li style="border-bottom: 4px solid var(--acc-green);" id="liDeposit" onclick="showDeposit()">Deposit</li>
		<li style="border-bottom: 4px solid var(--acc-red);" id="liWithdraw" onclick="showWithdraw()">Withdraw</li>
		<li style="border-bottom: 4px solid var(--acc-blue);" id="liTransactions" onclick="showTransactions()">Transactions</li>
		<li style="border-bottom: 4px solid var(--grey);" id="liAllData" onclick="showAllData()">All data</li>
	</ul>
	<ul class="modeIcon">
		<li id="lightMode" onclick="lightMode()"><img src="pix/icon_light_mode.webp" alt="light mode"></li>
		<li id="darkMode" onclick="darkMode()"><img src="pix/icon_dark_mode.webp" alt="dark mode"></li>
	</ul>
`;

const btnLightMode = document.querySelector("#lightMode");
const btnDarkMode = document.querySelector("#darkMode");

let config = {}

const lightMode = () => {
	document.body.classList.add("light");
	btnLightMode.style.display = "none";
	btnDarkMode.style.display = "block";
	config.mode = "light";
	localStorage.setItem("badBankConfig", JSON.stringify(config));
}

const darkMode = () => {
	document.body.classList.remove("light");
	btnDarkMode.style.display = "none";
	btnLightMode.style.display = "block";
	config.mode = "dark";
	localStorage.setItem("badBankConfig", JSON.stringify(config));
}

const getConfig = () => {
	if (localStorage.getItem("badBankConfig") === null) {
		config = {
			mode: "dark"
		}
	} else {
		config = JSON.parse(localStorage.getItem("badBankConfig"));
		// mode = config.mode;
	};
	console.log("config: " + JSON.stringify(config));
}

getConfig();
config.mode === "light" ? lightMode() : darkMode();