import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import PopularListings from "../components/PopularListings/PopularListings";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Features from "../components/Features/Features";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <PopularListings />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;
