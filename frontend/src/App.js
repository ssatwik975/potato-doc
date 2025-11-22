import './styles/global.css';
import { Cursor } from './components/layout/Cursor';
import { Navbar } from './components/layout/Navbar';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Hero } from './components/sections/Hero';
import { Stats } from './components/sections/Stats';
import { DiseaseComparison } from './components/sections/DiseaseComparison';
import { Scanner } from './components/sections/Scanner';
import { Assistant } from './components/sections/Assistant';
import { Footer } from './components/sections/Footer';
import { DiagnosisProvider } from './context/DiagnosisContext';

function App() {
  return (
    <DiagnosisProvider>
      <div className="noise-overlay"></div>
      <Cursor />
      <Navbar />
      <SmoothScroll>
        <Hero />
        <Scanner />
        <Assistant />
        <DiseaseComparison />
        <Stats />
        <Footer />
      </SmoothScroll>
    </DiagnosisProvider>
  );
}

export default App;
