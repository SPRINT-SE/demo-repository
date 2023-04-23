import mysql from "mysql2/promise";
import City from "../models/city.mjs";
import Country from "../models/country.mjs";

export default class DatabaseService {
  conn;

  constructor(conn) {
    this.conn = conn;
  }

  /* Establish database connection and return the instance */
  static async connect() {
    const conn = await mysql.createConnection({
      host: process.env.DATABASE_HOST || "localhost",
      user: "user",
      password: "password",
      database: "world",
    });

    return new DatabaseService(conn);
  }

  /* Get a list of all cities */
  async getCities() {
    try {
      // Fetch cities from database
      const data = await this.conn.execute("SELECT * FROM `city`");
      return data;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  /* Get a particular city by ID, including country information */
  async getCity(cityId) {
    const sql = `
        SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.Population as CountryPopulation
        FROM city
        INNER JOIN country ON country.Code = city.CountryCode
        WHERE city.ID = ${cityId}
    `;
    const [rows, fields] = await this.conn.execute(sql);
    /* Get the first result of the query (we're looking up the city by ID, which should be unique) */
    const data = rows[0];
    const city = new City(
      data.ID,
      data.Name,
      data.CountryCode,
      data.District,
      data.Population
    );
    const country = new Country(
      data.Code,
      data.Country,
      data.Continent,
      data.Region,
      data.CountryPopulation
    );
    city.country = country;
    return city;
  }

  /* Delete a city by ID */
  async removeCity(cityId) {
    const res = await this.conn.execute(
      `DELETE FROM city WHERE id = ${cityId}`
    );
    console.log(res);
    return res;
  }

  async getContinents(){
    try{
      const sql = `SELECT Continent FROM country GROUP BY Continent;`;
      const continent = await this.conn.execute(sql);
      return continent;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getRegions(){
    try{
      const sql = `SELECT Region FROM country GROUP BY Region;`;
      const region = await this.conn.execute(sql);
      return region;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountry(code){
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID WHERE ct.Code = '${code}';`;
      const country = await this.conn.execute(sql);
      return country;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountriesWorld() {
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID ORDER BY ct.Population DESC;`;
      const countries = await this.conn.execute(sql);
      return countries;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountriesContinent(continentName){
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID WHERE ct.Continent = '${continentName}' ORDER BY ct.Population DESC;`;
      const countries = await this.conn.execute(sql);
      return countries;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountriesRegion(regionName){
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID WHERE ct.Region = '${regionName}' ORDER BY ct.Population DESC;`;
      const countries = await this.conn.execute(sql);
      return countries;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountriesWorldLimit(limit) {
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID ORDER BY ct.Population DESC LIMIT ${limit};`;
      const countries = await this.conn.execute(sql);
      return countries;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountriesContinentLimit(continentName, limit){
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID WHERE ct.Continent = '${continentName}' ORDER BY ct.Population DESC LIMIT ${limit};`;
      const countries = await this.conn.execute(sql);
      return countries;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountriesRegionLimit(regionName, limit){
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID WHERE ct.Region = '${regionName}' ORDER BY ct.Population DESC LIMIT ${limit};`;
      const countries = await this.conn.execute(sql);
      return countries;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  /* Get a list of capital_cities */
  async getcapital_cities() {
    try{
      const sql = `SELECT ct.Code, ct.Name, ct.Continent, ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID ORDER BY ct.Population DESC;`;
      const capital_cities = await this.conn.execute(sql);
      return capital_cities;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }
  async getcapital_citiesContinent(){
    try{
      const sql = `SELECT ct.Name, ct.Continent, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID ORDER BY ct.Population DESC;`;
      
      const continent_of_capital = await this.conn.execute(sql);
      return continent_of_capital;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getcapital_citiesContinentLimit(continentName, limit){
    try{
      const sql = `SELECT ct.Code, ci.Name, ct.Continent, ct.Population,  as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID WHERE ct.Continent = '${continentName}' ORDER BY ct.Population DESC LIMIT ${limit};`;
      const capital_cities = await this.conn.execute(sql);
      return capital_cities;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getcapital_citiesRegionLimit(regionName, limit){
    try{
      const sql = `SELECT ct.Code, ct.Name,  ct.Region, ct.Population, ci.Name as 'Capital' FROM country ct JOIN city ci ON ct.Capital = ci.ID WHERE ct.Region = '${regionName}' ORDER BY ct.Population DESC LIMIT ${limit};`;
      const capital_cities = await this.conn.execute(sql);
      return capital_cities;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }
 
}