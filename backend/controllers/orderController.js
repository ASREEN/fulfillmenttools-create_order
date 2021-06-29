let axios = require("axios");
// const { json, response } = require("express");
// let fetch = require("node-fetch");

// ********************   willcome to my backend code  ***********************
function willcome(req, res) {
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

// *************************  create order from pickjob ******************************
async function createOrder(req, res) {
  let postData = req.body;
  console.log({ postData });
  let token = req.token.idToken;

  try {
    const resData = await axios.create({
      baseURL: process.env.CREATE_ORDER_API,
      headers: {
        post: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      data: postData,
    });

    console.log("line 51  ~ post_axios", resData);
    res.status(200).json(resData.defaults.data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = {
  willcome,
  createOrder,
  getToken,
};
