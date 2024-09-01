const { default: ollama } = require('ollama');

module.exports = async function embedder(text) {
    try {
        const response = await ollama.embeddings({
            model: "snowflake-arctic-embed",
            prompt: text,
        });
        return response;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
