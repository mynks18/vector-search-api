const magazineService = require('../services/MagazineService');

// add magazine function
async function addMagazine(req, res) {
    try {
        const {
            title,
            author,
            publication_date,
            category,
            content
        } = req.body;

        // Call the service to add the magazine information and content
        const newMagazine = await magazineService.addMagazineWithContent({
            title,
            author,
            publication_date,
            category,
            content
        });

        res.status(201).json({
            message: 'Magazine added successfully.',
            data: newMagazine,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding magazine.',
            error: error.message,
        });
    }
}

// async function getAll(req, res) {
//     try {
//         const magazines = await magazineService.getAllMagazineInfo();

//         res.status(200).json(magazines);
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error adding magazine.',
//             error: error.message,
//         });
//     }

// }

// vector search function
async function vectorSearch(req, res) {
    const { query } = req.body
    const { page } = req.params.page;
    try {
        const results = await magazineService.getVectorSearch(query, page);

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({
            message: 'Error adding magazine.',
            error: error.message,
        });
    }

}

// full text search function
async function fullTextSearch(req, res) {
    const { query } = req.body
    const { page } = req.params.page;
    try {
        const results = await magazineService.fullTextSearch(query, page);

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({
            message: 'Error adding magazine.',
            error: error.message,
        });
    }

}

async function hybridSearch(req, res) {
    const { query } = req.body;
    const { page } = req.params;

    try {
        // fetch results from both vector and full-text search services in parallel
        const [vectorResults, fullTextResults] = await Promise.all([
            magazineService.getVectorSearch(query, page),
            magazineService.fullTextSearch(query, page),
        ]);

        /* 
            ******************************

            HYBRID SEARCH IMPLEMENTATION STARTS HERE
            
            ******************************
        
        */

        // Convert results from fullTextResults to sets to find common elements by comparing id
        // Text search elements will b
        const fullTextSet = new Set(fullTextResults.map(item => item.id));

        // Find common elements by matching IDs
        const commonElements = vectorResults.filter(item => fullTextSet.has(item.id));

        // Create a set to track seen IDs
        const seenIds = new Set(commonElements.map(item => item.id));

        // Add unique elements from full-text results and vector results that are not in commonElements
        const remainingFullText = fullTextResults.filter(item => !seenIds.has(item.id));
        const remainingVector = vectorResults.filter(item => !seenIds.has(item.id));

        // Update the seenIds set with the remaining full-text IDs
        remainingFullText.forEach(item => seenIds.add(item.id));

        // Add remaining vector items only if they are not already seen
        const uniqueRemainingVector = remainingVector.filter(item => !seenIds.has(item.id));

        // Combine all elements: common first, then full-text, then vector results
        const combinedResults = [...commonElements, ...remainingFullText, ...uniqueRemainingVector];

        res.json(combinedResults);

    } catch (error) {
        res.status(500).json({
            message: 'Error searching magazines.',
            error: error.message,
        });
    }
}


module.exports = {
    addMagazine,
    // getAll,
    vectorSearch,
    fullTextSearch,
    hybridSearch
};