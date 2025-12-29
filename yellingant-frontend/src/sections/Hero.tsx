import { useState, useEffect } from 'react';
import HeroImage1 from '../assets/Yelling Ant Quiz Hero.png';
import HeroImage2 from '../assets/Yelling Ant Quiz Hero (1).png';
import HeroImage3 from '../assets/Yelling Ant Quiz Hero (2).png';
import Navbar from '../components/layout/Navbar';
const heroImages = [HeroImage1, HeroImage2, HeroImage3];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="w-[90%] mx-auto">
        
        {/* Top Banner Section with Illustration */}
        <div className="w-full h-[402px] bg-[#F3CF00] rounded-3xl overflow-hidden relative mb-12">
          <img
            src={heroImages[currentImageIndex]}
            alt="Hero background"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </div>

        {/* Text Content Section */}
        <div className="flex flex-col items-center text-center gap-3 w-full mb-8">
          {/* Heading */}
          <h1 className="font-gotham font-medium text-[52px] leading-[64px] tracking-tight text-black max-w-5xl">
            Quizzes That Know Your Humor, Your Vibes, and Your Culture
          </h1>

          {/* Subheading */}
          <p className="font-helvetica font-normal text-[24px] text-gray-500 max-w-[768px] mt-1">
            Jump into the stories, memories, and moments we all grew up with.
          </p>
        </div>

       {/* Navigation and Button Row (constrained width to match Figma) */}
        
            <Navbar />
        
       

      </div>
    </section>
  );
};

export default Hero;