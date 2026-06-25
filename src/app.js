const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const usersRoutes = require('./modules/users/users.routes.js')
const loginRoutes = require('./modules/auth/auth.routes.js')
const walletRoutes = require('./modules/wallets/wallets.routes.js')
const transactionsRoutes = require('./modules/transactions/transactions.routes.js')

const { globalLimiter } = require('./middlewares/rateLimit.middleware.js')

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter)
//ROUTES ==================================
app.use('/api/v1', usersRoutes)
app.use('/api/v1', transactionsRoutes)
app.use('/api/v1', loginRoutes)
app.use('/api/v1', walletRoutes)

module.exports = app;
