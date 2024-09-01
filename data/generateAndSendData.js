const axios = require('axios');
const faker = require('faker');

const API_URL = 'http://localhost:3000/api/v1/magazine';

// Sample categories and themes for content generation
const categories = ['Technology', 'Health', 'Business', 'Lifestyle', 'Entertainment'];
const topics = {
    Technology: [
        'The rise of AI in everyday life',
        'Cybersecurity threats in 2024',
        'The impact of 5G on connectivity',
        'Top programming languages of the year',
        'Future of blockchain beyond cryptocurrencies'
    ],
    Health: [
        'Mental health awareness in the digital age',
        'Advancements in cancer treatment',
        'Nutrition tips for a healthy lifestyle',
        'The role of technology in fitness',
        'Understanding the human microbiome'
    ],
    Business: [
        'Strategies for startups in a competitive market',
        'The impact of remote work on productivity',
        'Navigating economic uncertainty',
        'Leadership trends in 2024',
        'Sustainable business practices'
    ],
    Lifestyle: [
        'Minimalism: A guide to a simpler life',
        'The benefits of mindfulness and meditation',
        'Trends in sustainable fashion',
        'The influence of social media on modern living',
        'Balancing work and life effectively'
    ],
    Entertainment: [
        'The evolution of streaming services',
        'Top movies and shows to watch in 2024',
        'The rise of virtual reality gaming',
        'Music industry trends post-pandemic',
        'Behind the scenes of major film productions'
    ]
};

// Function to generate a high-quality magazine entry
function generateMagazineEntry() {
    const category = faker.random.arrayElement(categories);
    const title = faker.random.arrayElement(topics[category]);
    const author = faker.name.findName();
    const content = faker.lorem.paragraphs(3); // Generate 3 paragraphs of relevant content

    return {
        title,
        author,
        category,
        content
    };
}

// Function to send a POST request to add a magazine entry
async function addMagazine(entry) {
    try {
        const response = await axios.post(API_URL, entry, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`Added: ${response.data.data.magazineInfo.title}`);
    } catch (error) {
        console.error('Error adding magazine:', error.response ? error.response.data : error.message);
    }
}

// Main function to generate and send 100 entries
async function generateAndSendData(count = 100) {
    for (let i = 0; i < count; i++) {
        const entry = generateMagazineEntry();
        await addMagazine(entry);
    }
}

// Run the script
generateAndSendData(50);
