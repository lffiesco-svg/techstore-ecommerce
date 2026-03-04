import Navbar from "../Layout/Navbar.jsx";
import Hero from "../Home/Hero.jsx";
import Categoria from "../Home/Categoria.jsx";
import FeaturedProducts from "../Home/Featureproducts.jsx";
import Newsletter from "../Home/Newsletter.jsx";
import Footer from "../Layout/Footer.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <Hero />
      <Categoria />
        <FeaturedProducts />
        <Newsletter />
        
    
    </div>
  );
}

export default App;