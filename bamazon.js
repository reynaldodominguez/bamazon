var inquirer = require("inquirer");

var Table = require("cli-table");

var mysql = require("mysql");

var intents = 0;

var totalPurchased = 0;

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId + "\n");
});

function login() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "\n\n\n\n\n\n\n\n\n\n\n\n\n\nwhat kind of user are you?",
            choices: ["Seller", "Buyer", "Manager", "Exit"]
        }
    ]).then(function (selection) {
        if (selection.options === "Exit") {
            closeProgram()
        } else {
            password(selection);
        }
    });
}

function password(selection) {
    if (intents < 3) {
        inquirer.prompt([
            {
                type: "password",
                message: "Please insert your password",
                name: "pass",
                mask: "*"
            }
        ]).then(function (sel) {

            connection.query("SELECT password FROM users WHERE user = ?"
                , selection.options,
                function (err, res) {
                    if (err) throw err;
                    if (sel.pass === res[0].password) {
                        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\nLogin Sucessfull!!!");
                        switch (selection.options) {
                            case "Seller":
                                console.log("Seller Module \nHere you can add the products to sell\nPlease insert the info of your product");
                                seller()
                                break;
                            case "Buyer":
                                buyer()
                                break;
                            case "Manager":
                                manager()
                                break;
                            default:
                                console.log("Error");
                        }

                    } else {
                        console.log("Wrong Password");
                        intents++;
                        password(selection);
                    }

                }
            );
        });
    } else {
        console.log("You tried too many times");
        closeProgram();
    }
}

function seller() {

    inquirer.prompt([
        {
            type: "input",
            message: "\n\n\n\Please insert your product name",
            name: "name",
        },
        {
            type: "list",
            message: "Please select the department",
            name: "department",
            choices: ["Sports", "Camping"]
        },
        {
            type: "input",
            message: "Please insert the product price",
            name: "price"
        },
        {
            type: "input",
            message: "Please insert how many pieces you want to sell",
            name: "quantity"
        }
    ]).then(function (productToSell) {
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: productToSell.name,
                department_name: productToSell.department,
                price: productToSell.price,
                stock_quantity: productToSell.quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(" Product inserted!\n");

                inquirer.prompt([
                    {
                        type: "confirm",
                        message: "Do you want add another product?",
                        name: "opt",
                    }
                ]).then(function (cont) {
                    if (cont.opt) {
                        seller();
                    } else {
                        closeProgram();
                    }
                });

            }
        );

    });
}

function buyer() {
    console.log("Buyer Function");
    var productArr = []
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            //console.log("\nID: " + res[i].item_id + "     Product Name: " + res[i].product_name+ "     Department: " + res[i].department_name + "     Price: " + res[i].price+ " USD"+ "     Stock: " + res[i].stock_quantity);
            productArr.push("ID: " + res[i].item_id + "     Product Name: " + res[i].product_name + "     Price: " + res[i].price + " USD");
        }
        //console.log(productArr);
        inquirer.prompt([
            {
                type: "list",
                name: "opt",
                message: "Please select the product to Buy",
                choices: productArr
            }
        ]).then(function (select) {
            var idToBuy = select.opt
            idToBuy = idToBuy.charAt(4) + idToBuy.charAt(5);
            checkStock(idToBuy);

        });
    });




}

function checkStock(idToBuy) {
    inquirer.prompt([
        {
            type: "input",
            message: "How many pieces do you want to buy?",
            name: "qty"
        }
    ]).then(function (select) {

        connection.query("SELECT stock_quantity, price FROM products WHERE item_id = ?"
            , idToBuy,
            function (err, res1) {
                if (err) throw err;
                if (select.qty > res1[0].stock_quantity) {
                    console.log("Not Enougth stock please select less than " + res1[0].stock_quantity + " pcs")
                    checkStock(idToBuy);
                } else {
                    console.log("You buy of " + select.qty + " pieces is complete");
                    totalPurchased = totalPurchased + (select.qty * res1[0].price);
                    newStock = res1[0].stock_quantity - select.qty;
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: idToBuy
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log("New Stock: " + newStock);

                            inquirer.prompt([
                                {
                                    type: "confirm",
                                    message: "Do you want to buy another product?",
                                    name: "opt1",
                                }
                            ]).then(function (cont) {
                                if (cont.opt1) {
                                    buyer();
                                } else {
                                    console.log("Your total for this purchase is: " + totalPurchased + " USD");

                                    closeProgram();
                                }
                            });

                        }
                    );


                }


            });

    });

}

function closeProgram() {
    connection.end();
}

function manager() {
    console.log("Manager Module");
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "\n\n\n\n\n\n\n\n\n\n\n\n\n\nWhat operation you need to do?",
            choices: ["View products for sale", "Low inventory", "Add inventory", "Add new product", "Exit"]
        }
    ]).then(function (selection) {

        switch (selection.options) {
            case "View products for sale":
                showProducts()
                break;
            case "Low inventory":
                lowInventory()
                break;
            case "Add inventory":
                addInventory();
                break;
            case "Add new product":
                addProduct()
                break;
            case "Exit":
                closeProgram();
                break;
            default:
                console.log("Error");
        }
    });
}

function showProducts() {

    var table = new Table({
        head: ["Id", "Product Name", "Price", "Stock"]
        , colWidths: [10, 40, 15, 10]
    });

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            //console.log("\nID: " + res[i].item_id + "     Product Name: " + res[i].product_name+ "     Department: " + res[i].department_name + "     Price: " + res[i].price+ " USD"+ "     Stock: " + res[i].stock_quantity);
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());

        inquirer.prompt([
            {
                type: "confirm",
                message: "Do you want continue?",
                name: "opt1",
            }
        ]).then(function (cont) {
            if (cont.opt1) {
                manager();
            } else {
                closeProgram();
            }
        });

    });
}

function lowInventory() {

    var table = new Table({
        head: ["Id", "Product Name", "Stock"]
        , colWidths: [10, 40, 10]
    });

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].stock_quantity]);
        }
        console.log(table.toString());

        inquirer.prompt([
            {
                type: "confirm",
                message: "Do you want continue?",
                name: "opt1",
            }
        ]).then(function (cont) {
            if (cont.opt1) {
                manager();
            } else {
                closeProgram();
            }
        });

    });
}

function addProduct() {

    inquirer.prompt([
        {
            type: "input",
            message: "\n\n\n\Please insert the product name",
            name: "name",
        },
        {
            type: "list",
            message: "Please select the department",
            name: "department",
            choices: ["Sports", "Camping"]
        },
        {
            type: "input",
            message: "Please insert the product price",
            name: "price"
        },
        {
            type: "input",
            message: "Please insert how many pieces",
            name: "quantity"
        }
    ]).then(function (productToSell) {
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: productToSell.name,
                department_name: productToSell.department,
                price: productToSell.price,
                stock_quantity: productToSell.quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(" Product inserted!\n");

                inquirer.prompt([
                    {
                        type: "confirm",
                        message: "Do you want add another product?",
                        name: "opt",
                    }
                ]).then(function (cont) {
                    if (cont.opt) {
                        addProduct();
                    } else {
                        inquirer.prompt([
                            {
                                type: "confirm",
                                message: "Do you want continue?",
                                name: "opt1",
                            }
                        ]).then(function (cont) {
                            if (cont.opt1) {
                                manager();
                            } else {
                                closeProgram();
                            }
                        });
                    }
                });

            }
        );

    });
}

function addInventory() {
    var productArr = []
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            productArr.push("ID: " + res[i].item_id + "     Product Name: " + res[i].product_name+ "     Department: " + res[i].department_name + "     Price: " + res[i].price+ " USD"+ "     Stock: " + res[i].stock_quantity);
        }
        //console.log(productArr);
        inquirer.prompt([
            {
                type: "list",
                name: "option",
                message: "Please select the product to add inventory",
                choices: productArr
            },
            {
                type: "input",
                message: "Please insert how many pieces do you want to add",
                name: "quantity"
            }
        ]).then(function (select) {
            var productToUpdate = select.option.charAt(4) + select.option.charAt(5);
            connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", productToUpdate, function (err, res) {
                if (err) throw err;
                var newStock = parseInt(res[0].stock_quantity) + parseInt(select.quantity);
                console.log("New Stock " + newStock);

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newStock
                        },
                        {
                            item_id: productToUpdate
                        }
                    ],
                    function (err1, res1) {
                        if (err) throw err;
                        console.log(res1.affectedRows + " products updated!\n");
                        showProducts();
                    }
                );
            });

        });

    });

}

login();