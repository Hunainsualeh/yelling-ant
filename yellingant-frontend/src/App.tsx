import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import Hero from './sections/Hero.tsx';
import QuizCategories from './sections/QuizCategories.tsx';
import TrendingSection from './sections/TrendingSection.tsx';
import EditorsPicks from './sections/EditorsPicks.tsx';
import AdSlot from './components/ui/AdSlot.tsx';
import AdContainer from './components/ui/AdContainer.tsx';

function App() {
  return (
    <div className="bg-white overflow-x-hidden">
      
      <Header />
      {/* Top Takeover Ad - Shows on page load 
      <AdSlot slotId="YA_QHOME_TOP_001" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 my-4" />
      */}
      <Hero />
      
      <QuizCategories />
      
      {/* First Feed Ad */}
        <AdContainer heightClass="h-[236px]" widthClass="w-[90%] mx-auto">
        <AdSlot slotId="YA_QHOME_FEED_001" />
      </AdContainer>
      
      <TrendingSection />
      
      {/* Second Feed Ad */}
        <AdContainer heightClass="h-[174px]" widthClass="w-[90%] mx-auto">
        <AdSlot slotId="YA_QHOME_FEED_002" />
      </AdContainer>
      
      <EditorsPicks />
      
      <div className="w-full opacity-100 m-0 pl-0">
        <Footer />
      </div>

      {/* Third Feed Ad (after Footer) */}
      <AdContainer heightClass="h-[266px]" widthClass="w-[100%] mx-auto" className="rounded-tl-[4px] rounded-tr-[4px] m-0">
        <AdSlot slotId="YA_QHOME_FEED_003" />
      </AdContainer>
    </div>
  );
}

export default App;
