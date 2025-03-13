import React, { useState, useEffect } from "react";
import DNImageSlider from "./DbNewsImageSlider";

const DashNews = () => {
    const [newsData, setNewsData] = useState([]);
    const [images, setImages] = useState([]);
    const [featuredNews, setFeaturedNews] = useState(null); // For DN-section3
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch news from CryptoCompare API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
                const result = await response.json();

                if (result.Data) {
                    // Format news data for sticky content (limit to 3 items, include link)
                    const formattedNews = result.Data.slice(0, 3).map((newsItem) => ({
                        url: newsItem.imageurl || "https://via.placeholder.com/300", // Image URL
                        title: newsItem.title,
                        link: newsItem.url, // Article URL
                    }));

                    // Format images for the slider (limit to 3 items)
                    const formattedImages = result.Data.slice(0, 3).map((newsItem) => ({
                        url: newsItem.imageurl || "https://via.placeholder.com/300", // Fallback image if no URL
                        alt: newsItem.title,
                    }));

                    // Set featured news for DN-section3 (using the first item as an example)
                    const featured = {
                        title: result.Data[0].title,
                        link: result.Data[0].url,
                    };

                    setNewsData(formattedNews);
                    setImages(formattedImages);
                    setFeaturedNews(featured);
                } else {
                    throw new Error("No news data available");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div>Loading news...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <section className="DN-section">
                <DNImageSlider images={images} />
            </section>

            <section>
                <h1 className="DN-section2-title">News</h1>
                <DNStickyScroll data={newsData} />
            </section>
            <section className="DN-section3">
                <div className="DN-section3-container">
                    <h1 className="title">{featuredNews?.title}</h1>
                    <a
                        href={featuredNews?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="DN-section3-container-btn"
                    >
                        More Details
                    </a>
                </div>
            </section>
            <hr style={{ width: "80%", margin: "auto" }} />
        </>
    );
};

export default DashNews;

const DNStickyScroll = ({ data }) => {
    return (
        <div
            className="DN-sticky-scroll"
            style={{
                "--height": "400px",
                "--quantity": "3",
            }}
        >
            {data.map((item, index) => (
                <DNStickyContent key={index} data={item} index={index} />
            ))}
        </div>
    );
};

const DNStickyContent = ({ data, index }) => {
    return (
        <div
            className="Dn-sticky-container"
            style={{
                zIndex: index,
                top: "120px",
            }}
        >
            <div className="Dn-sticky-container-img">
                <img src={data.url} alt={data.title} />
            </div>
            <div className="Dn-sticky-container-content">
                <h1>{data.title}</h1>
                <a href={data.link} target="_blank" rel="noopener noreferrer">
                    More Details
                </a>
            </div>
        </div>
    );
};