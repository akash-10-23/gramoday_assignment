const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const AggReport = require("./AggReport");
const Report = require("./report");

const app = express();

// Connecting to MongoDB database
mongoose.connect("mongodb://localhost:27017/reportsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected Successfully!!!");
}).catch((err) => {
    console.log(err);
});

// Middleware----------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Routes ----------------------------------------------------------------

// 1. Post route for report creation
app.post("/reports", async (req, res) => {

    const { userID, marketID, marketName, marketType, cmdtyID, cmdtyName, priceUnit, convFctr, price } = req.body;

    const report = new Report({
        userID: userID,
        marketID: marketID,
        marketName: marketName,
        marketType: marketType,
        cmdtyID: cmdtyID,
        cmdtyName: cmdtyName,
        priceUnit: priceUnit,
        convFctr: convFctr,
        price: price
    });

    // Creating a Report Detail
    await Report.create(report, async (err, result) => {
        if (err)
            res.status(400).send("Error Occured while creating report details!!!");
        else {
            console.log("Report details added successfully!!!");

            // Creating an Aggregated Report
            const oldReport = await AggReport.findOne({
                cmdtyID: report.cmdtyID,
                marketID: report.marketID
            });

            // Case 1 : The given report details have new (marketID,cmdtyID) pair
            if (!oldReport) {
                const aggReport = new AggReport({
                reports: report._id,
                cmdtyName: report.cmdtyName,
                cmdtyID: report.cmdtyID,
                marketID: report.marketID,
                marketName: report.marketName,
                users: report.userID,
                priceUnit: "Kg",
                price: (report.price / report.convFctr)
            });

            await AggReport.create(aggReport, (err, result) => {
                if (err)
                    console.log(err);
                else {
                    res.status(201).json({
                        status: "success",
                        reportID: aggReport._id
                    });
                }
            });
                
            } else {
                // Case 2: The given (marketID,cmdtyID) exsits in the database
                const totalReports = oldReport.reports.length;
                const convertedPrice = (report.price / report.convFctr);
                const newPrice = (oldReport.price * totalReports + convertedPrice) / (totalReports + 1);
    
                await AggReport.findByIdAndUpdate(oldReport._id,
                {
                    $push: { reports: report._id, users: report.userID },
                    price: newPrice
                },
                { new: true, useFindAndModify: false }
                );

                res.status(201).json({
                    status: "success",
                    reportID: oldReport._id
                });
            }

        }
            
    });
});


// 2. Get route to get aggregate report with given reportID
app.get("/reports", async (req, res) => {

        const reportID = req.query.reportID;

        await AggReport.findById(reportID, (err, foundReport) => {
            if (err)
                res.send(400).send(err);
            else {
                if (!foundReport)
                    res.status(400).send("Report with given reportID not found!!!");
                else {
                    res.status(201).json({
                        _id: foundReport._id,
                        cmdtyName: foundReport.cmdtyName,
                        cmdtyID: foundReport.cmdtyID,
                        marketID: foundReport.marketID,
                        marketName: foundReport.marketName,
                        users: foundReport.users,
                        priceUnit: foundReport.priceUnit,
                        price: foundReport.price
                    });    
                }
                
            }
                
        });
});

// Starting backend server at local port 3000 (can be changed)
app.listen(3000, function() {
    console.log("Server started on port 3000");
});

// exporting app for test
module.exports = app;