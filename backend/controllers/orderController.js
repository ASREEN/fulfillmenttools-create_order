let axios = require("axios");
const { response } = require("express");
// const { json, response } = require("express");
// let fetch = require("node-fetch");

// ********************   willcome to my backend code  ***********************
function wellcome(req, res) {
  res.status(200).send("Willcome to my code");
}

// ************  middleware to create token for Authorization  ***************
let getToken = async (req, res, next) => {
  let data = JSON.stringify({
    email: "asreen@ocff-redtiger-git.com",
    password: "rNd59AI!",
    returnSecureToken: true,
  });

  // console.log("🚀 ~ file: orderController.js ~ line 15 ~ getToken ~ data", data)

  let config = {
    method: "post",
    url: process.env.CREATE_TOKEN_API,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  await axios(config).then((response) => {
    req.token = response.data;
  });
  next();
};

// *************************  create order from pickjob req.body from postman ******************************
async function createOrder(req, res) {
  let postData = req.body;
  console.log({ postData });
  let token = req.token.idToken;

  try {
    axios
      .post(process.env.CREATE_ORDER_API, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response2) => {
        console.log(response2);
        res.status(201).json(response2);
      })
      .catch((err) => console.log({ err }));
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Something went wrong." });
  }
}

// *************************  pickLineItems as a post Method from create Order ******************************
async function createOrder2(req, res) {
  let postData =  {"pickLineItems": [
    {
      "article": {
        "tenantArticleId": "4711",
        "title": "Cologne Water",
        "imageUrl": "string",
        "customAttributes": {},
        "attributes": [
          {
            "category": "descriptive",
            "priority": 100,
            "key": "%%subtitle%%",
            "value": "585er Gold"
          }
        ]
      },
      "quantity": 21,
      "scannableCodes": [
        "string"
      ],
      "customAttributes": {},
      "id": "climk4dcQFiPdA5ULuhS",
      "picked": 20,
      "status": "OPEN"
    }
  ]
}
  // console.log({ postData });
  let token = req.token.idToken;

  try {
    axios
      .post(process.env.CREATE_ORDER_API2, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response2) => {
        console.log(response2);
        res.status(201).json(response2);
      })
      .catch((err) => console.log({ err }));
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Something went wrong." });
  }
}
module.exports = {
  wellcome,
  createOrder,
  createOrder2,
  getToken,
};
