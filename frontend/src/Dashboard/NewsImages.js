const imageCount = 4; // Total number of images
const newsImages = {};

for (let i = 1; i <= imageCount; i++) {
    newsImages[`image${i}`] = require(`../asset/news-${i}.jpg`);
}

export default newsImages;

