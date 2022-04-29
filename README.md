# Gramoday Backend Assignment

### Installation of all packages

````
npm i
````

### Stating the server at port 3000

```
nodemon app.js
```

### Request from the API using Postman

1. Send a create report request: ``` POST /reports ```
````
http://localhost:3000/reports
````

- Add the following json file in Body > raw 
``````````````````````````````````````````
{
    "userID" : "user-1",
    "marketID" : "market-1",
    "marketName" : "Vashi Navi Mumbai",
    "cmdtyID" : "cmdty-1",
    "marketType": "Mandi",
    "cmdtyName": "Potato",
    "priceUnit" : "Pack",
    "convFctr": 50,
    "price" : 700
}
``````````````````````````````````````````
- Response
``````````````````````````````````````````
{
    "status": "success",
    "reportID": "626c054ecf48e6075646437f"
}
``````````````````````````````````````````
2. Get the aggregated report : ``` GET /reports?reportID=626c054ecf48e6075646437f ```
> the reportID should be the one which was in response of the above request(POST /reports)

- Response
```````````````````````````````````````````````````````
{
    "_id": "626c054ecf48e6075646437f",
    "cmdtyName": "Potato",
    "cmdtyID": "cmdty-1",
    "marketID": "market-1",
    "marketName": "Vashi Navi Mumbai",
    "users": [
        "user-1",
        "user-2"
    ],
    "priceUnit": "Kg",
    "price": 15
}
```````````````````````````````````````````````````````

### Testing
 Run the following for testing
 
 ````
 npm test
 ````
 
 Sample Output 
 ````````````````````````````````````````````````````````
  PASS  ./app.test.js
  POST /reports
    given a report detail
      √ create report and aggregate report (201 status code) (143 ms)
      √ do not create report and aggregate report (400 status code) (11 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.657 s, estimated 2 s
Ran all test suites.
 ````````````````````````````````````````````````````````
