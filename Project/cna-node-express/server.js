// server.js
// This is a simple Express.js application that connects to a MySQL database and provides 
// two REST API endpoints: one for fetching an inventory record by ID 
// and another for creating a new inventory record.
// The application uses Sequelize as an ORM to interact with the MySQL database. 
// It listens on a specified port and handles incoming requests to the defined endpoints.

require('dotenv').config(); // load environment variables from .env file
const dbConfig = require('./config/db.config.js'); // load database configuration

const express = require('express');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());


// code to allow Express.js application to connect to the cnainventory db
const Sequelize = require('sequelize');
const db = 'cnainventory'; // database name
const sequelize = new Sequelize(db, 'root', dbConfig.PASSWORD, {
    dialect: 'mysql', // database dialect
    host: 'localhost',        // database host
    port: 3306,        // database port
});

// map the data objects in the Express.js code to the data records in the
// database table
const Inventory = sequelize.define(
    'inventory', {
        id        : {type: Sequelize.INTEGER, allowNull: true, primaryKey: true},
        name      : {type: Sequelize.STRING,  allowNull: false},
        quantity  : {type: Sequelize.INTEGER, defaultValue: 0},
        date      : {type : Sequelize.DATE, defaultValue: Sequelize.NOW},
        createdAt : {type : Sequelize.DATE, defaultValue: Sequelize.NOW},
    }, {
        freezeTableName : true,
        timestamps : false
    }
);

// --- the two express REST API endpoints:

// add a route that accepts HTTP GET requests to fetch an inventory record
app.get('/inventory/:id', async(req, res) => {
    const id = req.params.id;
    console.log(`Fetching inventory record with id: ${id}`);
    try {
        const inventory = await Inventory.findAll({
            attributes : ['id', 'name', 'quantity', 'date','createdAt'],
            where : { id : id}
        });
        res.json({inventory});
    } catch(error) {
        console.error(error);
        res.status(500).send('Error fetching inventory record');
    }
});

// add a route that accepts HTTP POST requests to create a new inventory record
app.get('/inventory', async (req, res) => {
    console.log(`Accessing /inventory`);
    try {
        const inventory = await Inventory.findAll();
        res.json({ inventory });
    } catch (error) {
        console.error(error);
    }
});

// add a route that accepts HTTP POST requests to create a new inventory record
app.post('/inventory', async (req, res) => {
    console.log(`Creating new inventory record with body: ${req.body}`);
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.json({ inventory : newItem});
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error creating inventory record: \n${error.parent}`);
    }
});

app.post('/', async (req, res) => {
    console.log(`Accessing /`);
    try {
        const inventory = await Inventory.findAll();
        res.json({inventory});
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => console.log(`Sample app is listening on port ${port}`));
