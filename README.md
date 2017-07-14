# Bamazon

## Overview

Bamazon is an Amazon-like storefront as a CLI. It is a node app that stores locally via MySQL. The app can take in orders from customers and deplete stock from the store's inventory. In addition, it tracks product sales across the store's departments and and can provide a summary of the highest-grossing departments in the store.

## Setup

* NPM Install - to pull node dependencies.
* Run bamazonDB.sql in MySQL - to setup DB tables and data.


## Customer View

![Customer prompt](/images/cst01.png)

Customers are first displayed a table showing current stock of all products. They are then prompted to select (by ID) which product they would like to purchase.


![Product prompt](/images/cst02.png)

They are prompted again with the quantity of said product they would like to purchase. If there is enough stock to complete the transaction then a summary of purchase table is displayed and the customer is prompted to continue making purchases or exit. (At this time the database stock levels and product sales are updated)


![Insufficient Stock](/images/cst03.png)

If there is not enough stock to complete the transaction then no database data will change and the customer will be notified of the failed transaction.


## Manager View

The manager view can be accessed by adding the manager argument on the command line.
`node bamazon.js manager`

![Manager prompt](/images/mgr01.png)

Managers are first displayed a list of potential options. Examples below:


![View Products](/images/mgr02.png)

`View Products for Sale` displays a list of all available items for customers to purchase.


![View Low Inventory and Add](/images/mgr03.png)

`View Low Inventory` displays a list of all inventory items currently with a stock level of less than 5. `Add to Inventory` allows quantity to be added to stock for any item.


![Add Product](/images/mgr04.png)

`Add New Product` prompts the manager to define a new product's characteristics. At which time it will be added as a purchasable item for customers.


## Supervisor View

The supervisor view can be accessed by adding the super argument on the command line.
`node bamazon.js super`

![Supervisor prompt](/images/sup01.png)

Supervisors are first displayed a list of potential options. Examples below:


![View Sales](/images/sup02.png)

`View Product Sales By Department` displays a table of all departments (that currently have sales), their overhead, sales, and profit.


![Add Department](/images/sup03.png)

`Create New Department` prompts the supervisor to define a new department (name, overhead) and adds it to the database.

- - -

Enjoy!