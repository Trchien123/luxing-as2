import React from "react";
import "./style/introductionCard.css";

const IntroductionCard = () => {
  return (
    <div className="introduction-explore-background" id="introduction-card">
      <div className="introduction-container">
        <h1>Enhance Your Experience</h1>
        <p id="introduction-text">
          Discover why you should choose us for unparalleled service and value.
        </p>

        <div className="introduction-card-container">
          {cardData.map((card, index) => (
            <Card
              key={index}
              hue1={card.hue1}
              hue2={card.hue2}
              title={card.title}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ hue1, hue2, title, description, icon }) => {
  return (
    <article
      className="introduction-card-article"
      style={{
        "--hue-1": hue1,
        "--hue-2": hue2,
      }}
    >
      <div className="card-scale-1" />
      <div className="card-scale-2" />
      <div className="card-shape-1">
        <div className="card-shape-2">
          <div className="card-shape-3">
            <i className={`card-icon ${icon}`} />
          </div>
        </div>
      </div>
      <div className="card-data">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
      </div>
    </article>
  );
};

const cardData = [
  {
    hue1: 300,
    hue2: 30,
    title: "Innovative Design",
    description: "Creative solutions tailored to your needs.",
    icon: "ri-brush-line",
  },
  {
    hue1: 180,
    hue2: 50,
    title: "Sustainable Approach",
    description: "Eco-friendly and sustainable practices.",
    icon: "ri-leaf-line",
  },
  {
    hue1: 210,
    hue2: 238,
    title: "Technical Excellence",
    description: "Unmatched technical expertise and precision.",
    icon: "ri-cpu-line",
  },
];

export default IntroductionCard;
