const express = require("express");
const embedder = require('../utils/embedder')

const MagazineInformation = require('../models/MagazineInformation');
const MagazineContent = require('../models/MagazineContent');

const { addMagazine, getAll, vectorSearch, fullTextSearch, hybridSearch } = require('../controllers/MagazineController');

const router = express.Router();

router.post("/generate-embeddings", async (req, res) => {
    const { text } = req.body;

    try {
        const response = await embedder(text);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate embedding' });
    }
});

router.post("/", addMagazine);
// router.get('/', getAll);
// router.post('/vsearch/:page', vectorSearch);
// router.post('/tsearch/:page', fullTextSearch);
router.post('/hybridsearch/:page', hybridSearch);



module.exports = router;