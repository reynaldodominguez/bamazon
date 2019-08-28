DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  user VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
);

INSERT INTO users (user, password) VALUES ("Seller", "qwerty123");
SELECT * FROM  users

select * from products;

SELECT password FROM users WHERE user = "Seller"

INSERT INTO users (user, password) VALUES ("Buyer", 123);
