var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var consoleTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

//Start Screen
function welcomeScreen() {
  console.log("Bamazon Online Store Node Version!".green);
  console.log("---------------------------------------");
}
//Display table Code
function displayProducts() {
  console.log("Available Products: ".green);
  console.log("---------------------------------------");
  connection.query("SELECT *FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
};

//Prompt Code
function start() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "order_id",
        message: "What is the ID of the product would you like to purchase?".green,
      }])

      .then(function (answer) {
        var originalID = answer.order_id;
        var ProductID = answer.order_id - 1;
        console.log("You selected: " + res[ProductID].Product);

        inquirer.prompt([
          {
            name: "order_quantity",
            message: "How many woud you like?".green
          }]).then(function (answer) {
            var orderQuantity = answer.order_quantity;
            var stockQuantity = res[ProductID].Stock_Quantity;
            console.log("Quantity: ".green + orderQuantity);
            if (orderQuantity > stockQuantity) {
              console.log("Insufficient quantity, please change your product quantity.".green);
              inquirer.prompt([{
                name: "order_quantity",
                message: "How many woud you like?".green
              }])
            } else {
              var remainingQuantity = stockQuantity - orderQuantity;
              connection.query("UPDATE products SET ? WHERE ?",
                [{
                  Stock_Quantity: remainingQuantity
                },
                {
                  Item_ID: originalID
                }
                ], function () {
                  console.log("Quantity Left: ".green + remainingQuantity);
                  console.log("Order placed, Thanks for shopping!".green);
                  reStart();
                });
            };
          });
      });
  });
};

function reStart() {
  inquirer.prompt([
    {
      name: "keepShopping",
      type: "rawlist",
      message: "Would you like to buy more?",
      choices: ["YES", "NO"]
    }
  ]).then(function (answer) {
    if (answer.keepShopping == "YES") {
      start();
    } else {
      connection.end();
    }
  });
};
//Run Store
connection.connect(function (err) {
  if (err) {
    throw err
  };
  welcomeScreen();
  displayProducts();
  start();
});