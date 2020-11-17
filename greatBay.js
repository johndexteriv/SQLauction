var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "auction_db",
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	promptAuctionOptions();
});

const promptAuctionOptions = () => {
	return inquirer
		.prompt([
			{
				type: "list",
				name: "auctionoption",
				message:
					"Welcome to Great Bay Auction! Please select how you would like to proceed.",
				choices: ["Post", "Bid", "Exit"],
			},
		])
		.then((answer) => {
			if (answer.auctionoption == "Post") {
				newItem();
			} else if (answer.auctionoption == "Bid") {
				placeBid();
			} else if (answer.auctionoption == "Exit") {
				console.log("Thank you for using Great Bay Auctions!");
				connection.end();
			}
		});
};

const newItem = async () => {
	console.log("Inserting a new product...\n");
	const answers = await inquirer.prompt([
		{
			type: "input",
			name: "itemname",
			message: "What item would you like to list?",
		},
		{
			type: "number",
			name: "currentbid",
			message: "What price would you like to start the bidding at?",
		},
	]);
	var query = connection.query(
		"INSERT INTO listings SET ?",
		{
			item: answers.itemname,
			currentbid: answers.currentbid,
		},
		function (err, res) {
			if (err) throw err;
			console.log("Your product is now live! \n");
			// Call updateProduct AFTER the INSERT completes
			promptAuctionOptions();
		}
	);
};

const placeBid = () => {
	connection.query("SELECT * FROM listings", function (err, res) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: "choice",
					type: "rawlist",
					choices: () => {
						const choiceArray = res.map((listing) => listing.item);
						return choiceArray;
					},
					message: "What auction would you like to place a bid on?",
				},
				{
					name: "bid",
					type: "number",
					message: "How much would you like to bid?",
				},
			])
			.then((answer) => {
				let chosenItem;
				for (let i = 0; i < res.length; i++) {
					if (res[i].item == answer.choice) {
						chosenItem = res[i];
					}
				}
				if (chosenItem.highestbid < parseInt(answer.bid)) {
					connection.query(
						"UPDATE listings SET ? WHERE ?",
						[
							{
								highestbid: answer.bid,
							},
							{
								id: chosenItem.id,
							},
						],
						(err) => {
							if (err) throw err;
							console.log("Bid placed successfully!");
							promptAuctionOptions();
						}
					);
				} else {
					console.log("Your bid was too low. Try again...");
					promptAuctionOptions();
				}
			});
	});
};
