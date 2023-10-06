const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = process.env.API_URL;

const errorHandler = (error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send("Internal Server Error!");
}

router.use(errorHandler);

router.get("/", async (req, res, next) => {
    try {
        const response = await axios.get(`${url}recent-release`);
        const data = response.data;
        res.render("index", { data, title: "Stream and watch anime online for free on Animet" });
    } catch (error) {
        next(error);
    }
});

router.get("/airing", async (req, res, next) => {
    try {
        const data = [];
        for (let page = 1; page <= 3; page++) {
            const response = await axios.get(`${url}top-airing?page=${page}`);
            data.push(...response.data);
        }
        res.render("airing", { data, title: "Currently Airing" });
    } catch (error) {
        next(error);
    }
});

router.get("/popular", async (req, res, next) => {
    try {
        const response = await axios.get(`${url}popular`);
        const data = response.data;
        res.render("popular", { data, title: "Currently Popular" });
    } catch (error) {
        next(error);
    }
});

router.post("/search", async (req, res, next) => {
    try {
        const search = req.body.search;
        res.redirect(`/search?query=${search}`);
    } catch (error) {
        next(error);
    }
});

router.get("/search", async (req, res, next) => {
    try {
        const query = req.query.query;
        const response = await axios.get(`${url}search?keyw=${query}`);
        const data = response.data;
        res.render("search", { data, query, title: "Search" });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const response = await axios.get(`${url}anime-details/${id}`);
        const data = response.data;
        res.render("info", { data, id, title: data.animeTitle });
    } catch (error) {
        next(error);
    }
});

router.get("/:id/:episode", async (req, res, next) => {
    try {
        const id = req.params.id;
        const episode = req.params.episode;
        const [streamResponse, dataResponse] = await Promise.all([
            axios.get(`${url}vidcdn/watch/${episode}`),
            axios.get(`${url}anime-details/${id}`)
        ]);
        const stream = streamResponse.data;
        const data = dataResponse.data;
        res.render("stream", { stream, data, id, title: data.animeTitle });
    } catch (error) {
        next(error);
    }
});

module.exports = router