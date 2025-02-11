const cryptoImages = [];

// Require all images from the asset/cryptos folder
const images = require.context('../asset/cryptos', false, /\.(png|jpe?g|svg)$/);

images.keys().forEach((item, index) => {
    const imageName = item.replace('./', ''); // Remove the './' prefix
    cryptoImages[imageName] = images(item);
});
console.log(cryptoImages)
export default cryptoImages;
