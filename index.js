//Import express and axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

//express app and set the port number.
const app = express();
const port = 4000;

// API key and the URL for the public API, the api key is requested I had to create an account on their website.
const API_KEY = process.env.API_KEY; //Use your API KEY from the API website, You need to provide your own values. Check the .env.example file
const API_URL = process.env.API_URL;

// Set EJS as the view engine
app.set("view engine", "ejs");

//public folder for static files.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

//METHODS (get, post etc)
app.get("/", async (req, res) => {
    res.render("index");
});

app.post("/get-city", async (req, res) => {
    // req.body.city retrieves the attribute name inside the input (index.ejs)
    // and stores the data typed by the user
    const city_Name = req.body.city;
    // try and catch for the post method, you can use .then and .catch,
    // but I was taught it is a little old but both work fine I just prefered the try and catch
    //the try catches the data from the user and the params are needed (check api documentation)
    //It took me a while to understand the params and where to put it 🥲
    // I'm using the metrics system but you can change it in the params: units
    try {
        const response = await axios.get(API_URL, {
            params: {
                q: city_Name,
                appid: API_KEY,
                units: "metric",
            },
        });
        res.render("index.ejs", { weather: response.data });
        // the catch is just to send back some errors. If the user types something different that
        // is not a city for example and sends back a message instead of crashing the website
        // 404 (Not Found) - 401 (Unauthorized), you need the api key.
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        let errorMessage = "City not found. Please try again.";
        let cityError = city_Name;
        if (error.response) {
            if (error.response.status === 404) {
                cityError = city_Name;
                errorMessage = `not found. Please check the spelling.`;
            } else if (error.response.status === 401) {
                errorMessage = "API key error. Please check your API key.";
            }
        }

        res.render("index.ejs", { error: errorMessage, wrongCity: cityError });
    }
});

//Listen on your predefined port and start the server.
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
