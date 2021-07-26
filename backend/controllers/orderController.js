import axios from "axios";
//const mainUrl = process.env.MAIN_API;

// ********************   willcome to my backend code  ***********************
function wellcome(req, res) {
  res.status(200).send("Willcome to my code");
}

// ************  middleware to create token for Authorization  ***************
let getToken = async (req, res, next) => {
  let data = JSON.stringify({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
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

// *************************  create pickjob from req.body from postman ******************************
// *************************        localhost:5500/api/pickjob  ******************************************
async function createPickJob(req, res) {
  let postData = req.body;
  console.log({
    postData
  });
  let token = req.token.idToken;
  try {
    const response = await axios.post(process.env.MAIN_API + "/pickjobs", postData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status == 201) {
      console.log(response.data)
      res.status(201).json(response.data);
    }
  } catch (error) {
    console.log({
      error
    });
    res.status(500).json({
      message: "Something went wrong."
    });
  }
}

// *************************  create order from req.body from postman ******************************
// *************************        localhost:5500/api/orders  ******************************************
async function createOrder(req, res) {
  let token = req.token.idToken;
  try {
    const response = await axios.post(`${process.env.MAIN_API}/orders`, req.body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
    if (response.status == 201) {
      console.log(response.data)
      res.status(201).json(response.data);
    }
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
async function getPickjob(req, res, next) {
  let token = req.token.idToken;
  let pickjobId = req.params.id;
  try {
    const response = await axios.get(`${process.env.MAIN_API}/pickjobs/${pickjobId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
    if (response) {
      req.data = response.data;
      next()
    }
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
async function updateStatus(req, res, next) {
  let token = req.token.idToken;
  let pickjobData = req.data;
  let pickLineItems = pickjobData.pickLineItems; // get the array of pickline items
  let pickjob_id = pickjobData.id; //  get the id for this pickjob
  let pickLineItem = []; // Array to save an object for each pickline item contains id and quantiny. 
  for (let i = 0; i < pickLineItems.length; i++) {
    let item = {
      id: pickLineItems[i].id,
      quantity: pickLineItems[i].quantity
    }
    pickLineItem.push(item)
  }
  req.pickjob_id = pickjob_id
  req.pickLineItemsIdQuantity = pickLineItem; // array of ids and quantities
  let bodyData = {
    "version": 1,
    "actions": [{
      "action": "ModifyPickJob",
      "status": "IN_PROGRESS"
    }]
  }
  try {
    let url = `${process.env.MAIN_API}/pickjobs/${pickjob_id}`;
    const response = await axios
      .patch(url, bodyData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

    if (response) {
      console.log({
        response
      });
      next()
    }
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
async function perfectPick(req, res) {
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
    const response = await axios
      .patch(`${process.env.MAIN_API}/pickjobs/${pickjob_id}`, dataBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
    if (response) {
      console.log({
        data: response.data
      });
      res.status(201).json({
        message: "perfect job",
        response_result: response.data
      });
    }
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