const express = require('express');
const app = express();
const ExpressError = require('./helpers/expressError');
const cors = require('cors');

/** This allows other domains to make requests to the API */

app.use(cors());

/** This allows the app to parse all incoming data as JSON */

app.use(express.json());

/** This contains all relevant routes on the backend */

const accountRoutes = require('./routes/account');

app.use('/account', accountRoutes);

/** 404 error handler (TD) */

app.use((req, res, next) => {
    const err = new ExpressError('Not Found', 404);

    return next(err);
});

/** General error handler (TD) */

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;