import axios from "axios";
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
async function createPickJob(req, res) {
  let postData = req.body;
  console.log({
    postData
  });
  let token = req.token.idToken;
  console.log({
    tokenAA: token
  })

  try {
    // fetch(process.env.CREATE_ORDER_API_PICKJOBS, postData, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`
    //     }
    //   })
    //   .then(response => {
    //     response.json()
    //     console.log({
    //       line51_response: response
    //     })
    //     // res.status(201).json(response);
    //   })
    //   .then(created_pickjob => {
    //     console.log({
    //       created_pickjob
    //     })
    //     res.status(201).json(created_pickjob);
    //   })
    //   .catch((err) => console.log({
    //     err
    //   }));
    axios
      .post(process.env.CREATE_ORDER_API_PICKJOBS, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log({
          res_line50: response.data
        });
        res.status(201).json(response.data);
      })
      .catch((err) => console.log({
        err
      }));
  } catch (error) {
    console.log({
      error
    });
    res.status(500).json({
      message: "Something went wrong."
    });
  }
}

// *************************  pickLineItems as a post Method from create Order ******************************
async function createOrder(req, res) {
  let token = req.token.idToken;
  try {
    axios
      .post(process.env.CREATE_ORDER_API, req.body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log({
          response
        });
        res.status(201).json(response.data);
      })
      .catch((err) => console.log({
        err
      }));
  } catch (error) {
    console.log({
      catchError: error
    });
    res.status(500).json({
      message: "Something went wrong."
    });
  }
}

// ************************** PERECT PICK ****************************
// 1) GET THE PICKJOB WITH ID AND CHECK AND SEND THE DATA FOR THE NEXT MIDDLEWARE .
function getPickjob(req, res, next) {
  let token = req.token.idToken;
  let pickjobId = req.params.id;
  try {
    axios
      .get(process.env.GET_PICKJOB_ID + pickjobId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log({
          data: response.data
        });
        req.data = response.data;
        next()
      })
      .catch((err) => console.log({
        err
      }));
  } catch (error) {
    console.log({
      catchError: error
    });
    res.status(500).json({
      message: "Something went wrong."
    });
  }
}

//2) UPDATE STATUS FOR PICKJOB WITH THE ID INTO INPROGRESS. 
function updateStatus(req, res, next) {
  let token = req.token.idToken;
  let pickjobData = req.data;
  console.log({
    data_from_next: pickjobData
  })
  let pickLineItems = pickjobData.pickLineItems; // get the array of pickline items
  let pickjob_id = pickjobData.orderRef; // or let pickjob_id = pickjobData.id get the id for this pickjob
  console.log({
    pickjob_id
  })
  let pickLineItem = []; // Array to save an object for each pickline item contains id and quantiny. 
  for (let i = 0; i < pickLineItems.length; i++) {
    let item = {
      id: pickLineItems[i].id,
      quantity: pickLineItems[i].quantity
    }
    pickLineItem.push(item)
  }
  req.pickjob_id = pickjob_id
  req.pickLineItemsIdQuantity = pickLineItem; // array od ids and quantities
  let bodyData = {
    "version": 1,
    "actions": [{
      "action": "ModifyPickJob",
      "status": "IN_PROGRESS"
    }]
  }
  try {
    let url = process.env.UPDATE_PICKJOB_STATUS + pickjob_id;
    console.log({
      url
    })
    axios
      .patch(url, bodyData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log({
          response
        });
        next()
      })
      .catch((err) => console.log({
        err
      }));
  } catch (error) {
    console.log({
      catchError: error
    });
    res.status(500).json({
      message: "Something went wrong."
    });
  }
}

//3) PATCH call to close the Pickjob and perfect pick all the lines.
function perfectPick(req, res) {
  let token = req.token.idToken;
  let pickjob_id = req.pickjob_id;
  let pickLineItemsIdQuantity = req.pickLineItemsIdQuantity;
  let dataBody = {
    "version": 2,
    "actions": [{
      "action": "ModifyPickJob",
      "status": "CLOSED"
    }]
  }
  for (let i = 0; i < pickLineItemsIdQuantity.length; i++) {
    let pickJobPickLineItem = {
      "id": pickLineItemsIdQuantity[i].id,
      "action": "ModifyPickLineItem",
      "status": "CLOSED",
      "picked": pickLineItemsIdQuantity[i].quantity
    }
    dataBody.actions.push(pickJobPickLineItem); // Push the updated data into dataBody.actions array
  }

  try {
    console.log("???????????????????????????????????")
    console.log({
      dataBody
    })
    axios
      .patch(process.env.UPDATE_PICKJOB_STATUS + pickjob_id, dataBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log({
          data: response.data
        });
        res.status(201).json("perfect job");
      })
      .catch((err) => console.log({
        message: "This pickjob already closed",
        err
      }));
  } catch (error) {
    console.log({
      catchError: error
    });
    res.status(500).json({
      message: "Something went wrong."
    });
  }
}

export default {
  wellcome,
  createPickJob,
  createOrder,
  getToken,
  updateStatus,
  getPickjob,
  perfectPick
};