import React from 'react';

interface EditorCardProps {
  image: string;
  title: string;
}

const EditorCard: React.FC<EditorCardProps> = ({ image, title }) => (
  <div className="max-w-[384px] w-full h-[323.5px] rounded-[24px] border-[4px] border-white bg-white opacity-100 shadow-[0_4px_15px_0px_#ABABAB1A] flex flex-col items-center p-0 transform transition-transform duration-300 hover:scale-105">
    <img
      src={image}
      alt={title}
      className="max-w-[376px] w-full h-[211.5px] rounded-[12px] object-cover mt-1"
    />
    <div className="max-w-[328px] w-full h-[56px] flex flex-col justify-center mt-[16px] ml-[0px]">
      <h3 className="font-helvetica font-normal text-[20px] leading-[28px] tracking-[-0.45px] text-[#101828] max-w-[322px] w-full h-[28px]">
        {title}
      </h3>
    </div>
  </div>
);

export default EditorCard;
