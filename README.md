# **Bamazon App**

Link to video demostration https://drive.google.com/file/d/1s6JUPFuAEK1KATjyL-p6GGtsF49_8p_S/view

Link to database video https://drive.google.com/file/d/1TRelnRqxbZJ2YDsMqrSLlGUWmJ2qMhdw/view

Bamazon is a storefront with the MySQL database

This app was developed in Nodejs and MySQL and using inquirer, cli-table and mysql nmp packages

This app contains 3 principals modules, seller, buyer and manager module

At run the app the first step is select the module to use an input the password for the type of use selected, 

The passwords are validated with database and every time the user has 3 intent to input the rigth password at the 3th wrong password the app closed 

The passwords are the following:

Seller: qwerty123
Buyer: 123
Managaer: pass

In the seller module after sucessfull login the user must input info for the product to sell (name, department, price and how many pcs to sell all this info is saved into the database and the system ask is the user want to add another product if not the system finish the session

In the buyer module after sucessfull login the system get the products in the database and show an list of the available poducts to the user that must select one of the products then the user must insert how many pcs want to buy this amount is checked with the database to know if are enough quantity in the inventory if not are enough pcs the system show an message that no enough pcs availables and the stock avaliable and the user must select the pcs to buy after that the system ask if want buy another product and at the end the system show the total to pay for all the products

In the Manager module after sucessfull login the user must select one of the following options:

View products for sale: show all info for the products in the database

Low inventory: show products with less than 5 pcs in stock

Add inventory: show an list with all the products an the user must select one product and then input how many pcs want to add with this info is updated the database with the new stock for this product then the system show the updated inventory

Add new product: allow to the manager add an complete new product to the system

The system was developed by Luis Dominguez



