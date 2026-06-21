const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const usersRoutes = require ('./modules/users/users.routes.js')

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

//ROUTES ==================================
app.use('/api/v1', usersRoutes)

module.exports = app;
