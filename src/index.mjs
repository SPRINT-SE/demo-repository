/* Import dependencies */
import express from "express";
import mysql from "mysql2/promise";
import DatabaseService from "./services/database.service.mjs";

/* Create express instance */
const app = express();
const port = 3000;

/* Add form data middleware */
app.use(express.urlencoded({ extended: true }));

// Integrate Pug with Express
app.set("view engine", "pug");

// Serve assets from 'static' folder
app.use(express.static("static"));

const db = await DatabaseService.connect();
const { conn } = db;

/* Landing route */
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/continents", async (req, res) => {
  const [rows, fields] = await db.getContinents();
  return res.render("continents", {rows, fields});
});

app.get("/regions", async (req, res) => {
  const [rows, fields] = await db.getRegions();
  return res.render("regions", {rows, fields});
});

app.get("/countries", async (req, res) => {
  const [rows,fields] = await db.getCountriesWorld();
  return res.render("countries", {rows, fields});
});

app.get("/countries/:code", async (req, res) => {
  const code = req.params.code;
  const [rows,fields] = await db.getCountry(code);
  return res.render("countries", {rows, fields});
});

app.get("/countries/continent/:name", async (req, res) => {
  const continentName = req.params.name;
  const [rows, fields] = await db.getCountriesContinent(continentName);
  return res.render("countries", {rows, fields});
});

app.get("/countries/region/:name", async (req, res) => {
  const regionName = req.params.name;
  const [rows, fields] = await db.getCountriesRegion(regionName);
  return res.render("countries", {rows, fields});
});

app.get("/countries/continent/:name/:limit", async (req, res) => {
  const continentName = req.params.name;
  const limit = req.params.limit;
  const [rows, fields] = await db.getCountriesContinentLimit(continentName, limit);
  return res.render("countries", {rows, fields});
});

app.get("/countries/region/:name/:limit", async (req, res) => {
  const regionName = req.params.name;
  const limit = req.params.limit;
  const [rows, fields] = await db.getCountriesRegionLimit(regionName, limit);
  return res.render("countries", {rows, fields});
});
// Capital_cities route
app.get("/capital_cities", async (req, res) => {
  const [rows,fields] = await db.getcapital_cities();
  return res.render("capital_cities", {rows, fields});
});
// continent of Capital_cities route
app.get("/continent_of_capital", async (req, res) => {
  const continentName = req.params.name;
  const [rows, fields] = await db.getcapital_citiesContinent(continentName);
  return res.render("continent_of_capital", {rows, fields});
});
// /capital_cities/continent of Capital_cities route
app.get("/capital_cities/continent_of_capital/:name/:limit", async (req, res) => {
  const continentName = req.params.name;
  const [rows, fields] = await db. getcapital_citiesContinentLimit(continentName);
  return res.render("capital_cities", {rows, fields});
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { title: "Boring about page" });
});

app.get("/cities", async (req, res) => {
  const [rows, fields] = await db.getCities();
  /* Render cities.pug with data passed as plain object */
  return res.render("cities", { rows, fields });
});

app.get('/cities/:id', async (req, res) => {
  const cityId = req.params.id;
  const city = await db.getCity(cityId);
  return res.render('city', { city });
})

/* Update a city by ID */
app.post('/cities/:id', async (req, res) => {
  const cityId = req.params.id;
  const { name } = req.body;
  const sql = `
    UPDATE city
    SET Name = '${name}'
    WHERE ID = '${cityId}';
  `
  await conn.execute(sql);
  return res.redirect(`/cities/${cityId}`);
});

// Run server!
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});