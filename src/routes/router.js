const express = require("express");
const router = express.Router();
const { ANIME } = require("@consumet/extensions");

router.get("/", (req, res) => {
    const gogoanime = new ANIME.Gogoanime();
    gogoanime.fetchRecentEpisodes().then(data => {
        res.render("index", { data: data.results });
    });
});

router.get("/airing", (req, res) => {
    const gogoanime = new ANIME.Gogoanime();
    gogoanime.fetchTopAiring().then(data => {
        res.render("airing", { data: data.results });
    });
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const gogoanime = new ANIME.Gogoanime();
    gogoanime.fetchAnimeInfo(id).then(data => {
        res.render("info", { data });
    });
});

router.get("/:id/:episode", async (req, res) => {
    const id = req.params.id;
    const episode = req.params.episode;
    const gogoanime = new ANIME.Gogoanime();

    try {
        const [info, episodes] = await Promise.all([
            gogoanime.fetchAnimeInfo(id),
            gogoanime.fetchEpisodeSources(episode)
        ]);
        res.render("stream", { data: info, episode: episodes.sources });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred!" });
    }
});

module.exports = router