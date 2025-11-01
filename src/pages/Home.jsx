import React from "react";
import Carousel from "../componets/Home/Slider/Carousel";
import ProductCard from "../context/ProductCard";
import OurCoreValue from "../componets/Home/StoreValue/OurCoreValue";
import Review from "../componets/Home/Review/Review";
import Footer from "../componets/Footer/Footer";
import SetPageTitle from "../componets/SetPageTitle";
import Brand from "../componets/Home/brands/Brand";
// import VelocityText from "../componets/Home/text/VelocityText";

const Home = () => {
  return (
    <>
    <SetPageTitle title="Home - BuyNGO"/>
      {/* h-screen remove करें क्योंकि VelocityText का height बहुत ज्यादा है */}
      <div className="w-full">
        <Carousel />
        {/* <VelocityText /> */}
        <OurCoreValue />
        <Brand />
        <ProductCard />
        <Review />
        <Footer />
      </div>
    </>
  );
};

export default Home;
