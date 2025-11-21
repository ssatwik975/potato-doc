import './styles/global.css';
import { Cursor } from './components/layout/Cursor';
import { Navbar } from './components/layout/Navbar';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Hero } from './components/sections/Hero';
import { Stats } from './components/sections/Stats';
import { DiseaseComparison } from './components/sections/DiseaseComparison';
import { Scanner } from './components/sections/Scanner';
import { Footer } from './components/sections/Footer';

function App() {
  return (
    <>
      <div className="noise-overlay"></div>
      <Cursor />
      <Navbar />
      <SmoothScroll>
        <Hero />
        <Scanner />
        <DiseaseComparison />
        <Stats />
        <Footer />
      </SmoothScroll>
    </>
  );
}

export default App;
