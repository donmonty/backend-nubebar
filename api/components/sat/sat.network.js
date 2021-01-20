const express = require("express");
const response = require("../../../network/response");
const axios = require("axios");
//const got = require("got");
//const jsdom = require("jsdom");

const satURL =
  "http://siat.sat.gob.mx/app/qr/faces/pages/mobile/validadorqr.jsf?D1=4&D2=1&D3=Nn1664975253";

const router = express.Router();

// Routes
router.get("/", list);
router.get("/bottle", fetch);
router.get("/:id", get);

// Helper functions
async function fetchBottleId(encodedString) {
  //const id = req.params.id;
  //const url = satURL + encodedString;
  const url = "https://jsonplaceholder.typicode.com/todos/" + encodedString;
  console.log("El URL es: ", url);

  try {
    const data = await axios.get(url);
    console.log(data.data);
    return data.data;
  } catch (err) {
    console.error(`Something went wrong: ${err}`);
  }
}

/////////////////////////////////////////
async function crawlPage() {
  const { JSDOM } = jsdom;
  const url =
    "http://siat.sat.gob.mx/app/qr/faces/pages/mobile/validadorqr.jsf?D1=4&D2=1&D3=Nn1664975253";

  try {
    const response = await got(url);
    console.log("Request body:", response.body);
    const dom = new JSDOM(response.body);

    //function hasId

    const nodeList = [...dom.window.document.querySelectorAll("table")];
    console.log("Node list:", nodeList);
    return nodeList;
  } catch (err) {
    console.log("Error en el crawler", err);
  }
}

// Internal functions

// async function lista(req, res, next) {
//   const url = "https://jsonplaceholder.typicode.com/posts/";

//   try {
//     const data = await axios.get(url);
//     console.log("Post list: ", data.data);
//     response.success(req, res, data, 200);
//     return data.data;
//   } catch (err) {
//     console.log("Error en posts:", err);
//     response.error(req, res, err);
//   }
// }

///////////////////////////////
function list(req, res, next) {
  const url = "https://jsonplaceholder.typicode.com/posts/";
  axios
    .get(url)
    .then((data) => {
      //console.log("The posts:", data.data);
      response.success(req, res, data.data, 200);
      return data.data;
    })
    .catch((err) => {
      console.log("Error en posts:", err);
      response.error(req, res, err);
    });
}

//////////////////////
function get(req, res, next) {
  fetchBottleId(req.params.id)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((err) => {
      console.log("Error", err);
      response.error(req, res, err);
    });
}

////////////////////////////////
function fetch(req, res, next) {
  console.log("Entering crawlPage...");
  crawlPage()
    .then((nodeList) => {
      res.send("Nodelist parsed successfully!");
      console.log("Node list:", nodeList);
    })
    .catch((err) => {
      console.log("Error", err);
      response.error(req, res, err);
    });
}

module.exports = router;
