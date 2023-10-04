const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = process.env.API_URL;

router.get("/", async (req, res) => {
    const response = await axios.get(url + "recent-release");
    const data = response.data;
    res.render("index", { data, title: "Watch anime online for free" })
});

router.get("/airing", async (req, res) => {
    const page1 = axios.get(url + "top-airing?page=1");
    const page2 = axios.get(url + "top-airing?page=2");
    const page3 = axios.get(url + "top-airing?page=3");
    const [response1, response2, response3] = await Promise.all([page1, page2, page3]);
    const data1 = response1.data;
    const data2 = response2.data;
    const data3 = response3.data;
    const combinedData = [...data1, ...data2, ...data3];

    res.render("airing", { data: combinedData, title: "Currently Airing" });
});

router.get("/popular", async (req, res) => {
    const response = await axios.get(url + "popular");
    const data = response.data;
    res.render("popular", { data, title: "Currently Popular" })
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const response = await axios.get(url + "anime-details/" + id);
    const data = response.data;
    res.render("info", { data, id, title: data.animeTitle });
});

router.get("/:id/:episode", async (req, res) => {
    const id = req.params.id;
    const episode = req.params.episode;
    const response_1 = await axios.get(url + "vidcdn/watch/" + episode);
    const stream = response_1.data;
    const response_2 = await axios.get(url + "anime-details/" + id);
    const data = response_2.data;
    res.render("stream", { stream, data, id, title: data.animeTitle });
});


module.exports = router