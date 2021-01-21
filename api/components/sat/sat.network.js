const express = require("express");
const response = require("../../../network/response");
const axios = require("axios");
const puppeteer = require("puppeteer");

const router = express.Router();

// Routes
router.get("/", list);
//router.get("/bottle", fetch);
router.get("/:id", getBottleId);

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

// Internal functions

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
function getBottleId(req, res, next) {
  const id = req.params.id;
  scrapeBottleId(id)
    .then(bottleId => {
      response.success(req, res, bottleId, 200);
      console.log("Bottle ID:", bottleId);
    })
    .catch((err) => {
      console.log("getBottleId Error", err);
      response.error(req, res, err);
    });
}

/////////////////////////////////
async function scrapeBottleId(id) {
  const url = 'http://siat.sat.gob.mx/app/qr/faces/pages/mobile/validadorqr.jsf?D1=4&D2=1&D3=' + id;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const loadPage = await page.goto(url, { waitUntil: 'networkidle0' });
  await page.content()
  const data = await page.evaluate(
    () =>  Array.from(document.querySelectorAll('td'))
                .map(elem => elem.textContent)
                .filter(text => (`${text[0]}${text[1]}` === 'Nn') || (`${text[0]}${text[1]}` === 'Ii'))
  );
  console.log(data[0]);
  await browser.close();
  const bottleId = {id: data[0]};
  return bottleId;
}

module.exports = router;
