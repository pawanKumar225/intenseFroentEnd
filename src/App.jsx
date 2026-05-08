import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../src/components/routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import WhatsAppSticky from "./components/layout/WhatsAppSticky";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer />
      <WhatsAppSticky />
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;