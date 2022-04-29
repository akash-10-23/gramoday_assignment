const request = require('supertest');
const app = require('./app');

describe("POST /reports", () => {
  describe("given a report detail", () => {

    // all details are correctly entered
    test("create report and aggregate report (201 status code)", async () => {
      const response = await request(app).post("/reports").send({
        userID : "user-1",
        marketID : "market-1",
        marketName : "Vashi Navi Mumbai",
        cmdtyID : "cmdty-1",
        marketType : "Mandi",
        cmdtyName : "Potato",
        priceUnit : "Pack",
        convFctr : 50,
        price : 700
    })
      expect(response.statusCode).toBe(201)
    })

    // userId and marketId is missing so it will not create a report detail 
    test("do not create report and aggregate report (400 status code)", async () => {
      const response = await request(app).post("/reports").send({
        marketName : "Vashi Navi Mumbai",
        cmdtyID : "cmdty-1",
        marketType : "Mandi",
        cmdtyName : "Potato",
        priceUnit : "Pack",
        convFctr : 50,
        price : 700
    })
      expect(response.statusCode).toBe(400)
    })
  })
})
