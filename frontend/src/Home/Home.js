import React from "react";
import Menu from "../Menu";
import Footer from "../Footer"
import Container1 from "../HomeIntroduction";
import BlurContainer from "./HomeBlurContainer";
import IntroductionCard from "../gradientBorderCard";
import Sphere from "../../src/Home/Explore/Sphere";
const Home = () => {
    return (
        <>
            <Menu />
            <Container1 />
            <BlurContainer />
            <IntroductionCard />
            <Sphere />
            <Footer />

        </>
    )
}

export default Home