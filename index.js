const mysql = require("mysql2");
const fs = require("fs");

// Create a connection to the MySQL server
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "P@ssword2023",
  database: "casting2",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // SQL statement to create a table for cities
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS PM_ProjectGeographicLookups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      city_name VARCHAR(255) NOT NULL,
      country_name VARCHAR(255) NOT NULL
    );
  `;

  // Execute the SQL statement to create the table
  connection.query(createTableSQL, (createErr, results) => {
    if (createErr) {
      console.error("Error creating table:", createErr);
      return;
    }
    console.log("Cities table created");

    // Sample data to insert into the cities table
    const citiesData = JSON.parse(fs.readFileSync("cities.json", "utf-8"));
    const statesData = JSON.parse(fs.readFileSync("usstates.json", "utf-8"));
    const statisticalAreaData = JSON.parse(fs.readFileSync("statistical-area.json", "utf-8"));

    // SQL statement to insert data into the cities table
    const insertDataSQL =
      "INSERT INTO PM_ProjectGeographicLookups (code, name, group_code) VALUES ?";

    // Execute the SQL statement to insert data
    connection.query(
      insertDataSQL,
      [statesData.map((state) => [null, state, "STATE"])],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error("Error inserting data:", insertErr);
          return;
        }
        console.log("Data inserted");
      }
    );

    // Execute the SQL statement to insert data
    connection.query(
      insertDataSQL,
      [citiesData.map((city) => [null, city.cityName, "CITY"])],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error("Error inserting data:", insertErr);
          return;
        }
        console.log("Data inserted");
      }
    );

    // Execute the SQL statement to insert data
    connection.query(
      insertDataSQL,
      [statisticalAreaData.map((area) => [null, area, "STATISTICAL_AREA"])],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error("Error inserting data:", insertErr);
          return;
        }
        console.log("Data inserted");
      }
    );


  // Close the database connection
  connection.end((endErr) => {
    if (endErr) {
      console.error("Error closing the connection:", endErr);
      return;
    }
    console.log("Connection to MySQL closed");
  });
  });
});
