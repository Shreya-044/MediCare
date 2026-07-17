import Navbar from "../src/components/Navbar";
import Home from "../src/pages/Home";
import Footer from "../src/components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;