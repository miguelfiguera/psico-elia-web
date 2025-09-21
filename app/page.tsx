import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Packages from "./components/Packages";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <br />
        <About />
        <Services />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
