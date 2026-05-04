import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Branches from "./pages/Branches";
import Contact from "./pages/Contact";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
