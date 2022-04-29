const mongoose = require("mongoose");

const aggReport = new mongoose.Schema({

    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }],
    cmdtyName: String,
    cmdtyID: String,
    marketID: String,
    marketName: String,
    users: [{
        type: String
    }],
    priceUnit: String,
    price: Number
});

module.exports = mongoose.model("AggReport", aggReport);