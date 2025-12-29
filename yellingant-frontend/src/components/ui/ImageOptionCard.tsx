import React from "react";

interface ImageOptionCardProps {
  imageSrc: string;
  isSelected: boolean;
  correct: boolean;
  onClick: () => void;
  label?: string;
}

const ImageOptionCard: React.FC<ImageOptionCardProps> = ({
  imageSrc,
  isSelected,
  correct,
  onClick,
  label,
}) => {
  return (
    <div
      className={`relative w-full max-w-[320px] aspect-[4/3] rounded-xl border cursor-pointer overflow-hidden shadow transition-all duration-200
        ${isSelected ? (correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "border-gray-200 bg-white hover:shadow-lg"}
      `}
      onClick={onClick}
    >
      <img
        src={imageSrc}
        alt={label || "Option"}
        className="w-full h-full object-cover rounded-xl"
      />
      {label && (
        <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-white/80 text-sm font-semibold text-gray-700 shadow">
          {label}
        </div>
      )}
      {isSelected && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-2xl font-bold
            ${correct ? "text-green-600" : "text-red-600"}
          `}
        >
          {correct ? "✔" : "✖"}
        </div>
      )}
    </div>
  );
};

export default ImageOptionCard;
