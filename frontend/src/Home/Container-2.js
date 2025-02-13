import React from "react";
import Menu from "../Menu";
import Footer from "../Footer"
import Container1 from "../HomeIntroduction";
import BlurContainer from "../BlurComponent";
import IntroductionCard from "../gradientBorderCard";
import Sphere from "../Sphere";
import Sphere__head from "../Sphere__head";
const Home = () => {
    return (
        <>
            <Menu />
            <Container1 />
            <BlurContainer />
            <IntroductionCard />
            <Sphere__head />
            <Sphere />
            <Footer />

        </>
    )
}

export default Home