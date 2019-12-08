var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

/*connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected as id: " + connection.threadId + "\n");

})*/
//Display table Code
function displayProducts() {
  console.log("Available Products: ");
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
    inquirer
      .prompt([
        {
          name: "order_id",
          type: "text",
          message: "What is the ID of the product would you like to purchase?",
        }])

      .then(function (inquirerResponse) {
        var item_ID = inquirerResponse.order_id - 1;
        console.log("You selected: " + res[item_ID].Product);
        inquirer.prompt([
          {
            name: "order_quantity",
            type: "text",
            message: "How many woud you like?"
          }]).then(function (inquirerResponse) {
            console.log("Quantity: " + inquirerResponse.order_quantity);
            var remaningQuantity = res[item_ID].Stock_Quantity - inquirerResponse.order_quantity;
            if (remaningQuantity < 0) {
              console.log("Insufficient quantity, please change your product quantity.");
              remaningQuantity = res[item_ID].Stock_Quantity;
            } else {
              console.log("Order placed, Thanks for shopping!");
            };
          });
      });
  });
};

//Start Screen
function welcomeScreen() {
  console.log("Bamazon Online Store Node Version!");
  console.log("---------------------------------------");
}
//Run Store
connection.connect(function (err) {
  if (err) {
    throw err
  };
  welcomeScreen();
  displayProducts();
  start();
  connection.end();
});
