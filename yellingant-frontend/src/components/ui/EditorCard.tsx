import React from 'react';
import { Link } from 'react-router-dom';

interface EditorCardProps {
  image: string;
  title: string;
  slug?: string;
}

const EditorCard: React.FC<EditorCardProps> = ({ image, title, slug }) => {
  const cardContent = (
    <div className="w-full h-full min-h-[323.5px] rounded-[24px] border-[4px] border-white bg-white opacity-100 shadow-[0_4px_15px_0px_#ABABAB1A] flex flex-col p-1 transform transition-transform duration-300 hover:scale-105">
      <img
        src={image}
        alt={title}
        className="w-full h-[211.5px] rounded-[20px] object-cover"
      />
      <div className="w-full flex flex-col justify-center mt-[16px] px-2">
        <h3 className="font-helvetica font-normal text-[20px] leading-[28px] tracking-[-0.45px] text-[#101828] w-full line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link to={`/quiz/${slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default EditorCard;

