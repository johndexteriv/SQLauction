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
