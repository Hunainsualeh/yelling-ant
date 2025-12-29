import React from 'react';
import type { QuizQuestion } from '../types';

type Props = {
  question: QuizQuestion;
  selectedAnswer?: string;
  onAnswerSelect: (val: string) => void;
};

const QuizTypeFigmaQuestion: React.FC<Props> = ({ question, selectedAnswer, onAnswerSelect }) => {
  // Only removing text-input answer fields — selection will be handled elsewhere.

  return (
    <div className="w-[798px] mx-auto">
      <div className="w-full max-w-[782px] mx-auto">
        <div className="w-full rounded-[12px] bg-gradient-to-r from-[#FF9A45] to-[#FF6A00] px-6 py-4 text-center">
          <h3 className="text-[#FFFFFF] font-helvetica font-bold text-[24px] leading-[28px]">{question.question}</h3>
        </div>


        {/* Parent container with two child containers (image portion + text/input portion)
            Mirrors the per-option card layout from QuizTypeImageOptions.tsx */}
        <div className="flex flex-row justify-center gap-4 mb-6 mt-4 flex-wrap">
          {/* If the question has explicit options, render up to two option-style cards */}
          {question.options && question.options.length > 0 ? (
            question.options?.slice(0, 2).map((opt: any) => {
              const isSelected = selectedAnswer === opt.id;
              const showDim = selectedAnswer && !isSelected;
              return (
                <div
                  key={opt.id}
                  onClick={() => onAnswerSelect(opt.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onAnswerSelect(opt.id); }}
                  className={`relative flex flex-col items-center w-[379px] h-[377px] bg-white rounded-[12px] border-2 shadow-sm cursor-pointer transition-transform duration-150 ${showDim ? 'opacity-60' : 'opacity-100'} ${isSelected ? '' : 'border-gray-200'}`}
                    style={{ borderColor: isSelected ? '#AD46FF' : undefined }}
                >
                  <div className="w-full text-center px-4 py-4 bg-[#F9FAFB] ">
                    <span className="font-helvetica text-[24px] font-bold text-[#461799]">{opt.label ?? opt.text}</span>
                  </div>
                  <div className="w-full flex-1 overflow-hidden rounded-b-[12px]">
                    <img src={opt.image ?? question.image} alt={opt.label ?? opt.text ?? 'option'} className="w-full h-full object-cover" />
                  </div>
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-green-500 text-2xl font-bold">✔</span>
                  )}
                </div>
              );
            })
          ) : (
            // Fallback: render Cat (left) and DOG (right) cards
            <>
              {(() => {
                const catId = 'cat';
                const dogId = 'dog';
                const selectedCat = selectedAnswer === catId;
                const selectedDog = selectedAnswer === dogId;
                return (
                  <>
                    <div
                      onClick={() => onAnswerSelect(catId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') onAnswerSelect(catId); }}
                      className={`relative flex flex-col items-center w-[379px] h-[377px] bg-white rounded-[12px] border-2 shadow-sm cursor-pointer ${selectedDog ? 'opacity-60' : 'opacity-100'} ${selectedCat ? '' : 'border-gray-200'}`}
                        style={{ borderColor: selectedCat ? '#AD46FF' : undefined }}
                    >
                      <div className="w-full text-center px-4 py-4 bg-[#F9FAFB] ">
                        <span className="font-helvetica text-[24px] font-bold text-[#461799]">Cat</span>
                      </div>
                      <div className="w-full flex-1 overflow-hidden rounded-b-[12px]">
                        <img src={question.image ?? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'} alt="Cat" className="w-full h-full object-cover" />
                      </div>
                      {selectedCat && <span className="absolute top-2 right-2 text-green-500 text-2xl font-bold">✔</span>}
                    </div>

                    <div
                      onClick={() => onAnswerSelect(dogId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') onAnswerSelect(dogId); }}
                      className={`relative flex flex-col items-center w-[379px] h-[377px] bg-white rounded-[12px] border-2 shadow-sm cursor-pointer ${selectedCat ? 'opacity-60' : 'opacity-100'} ${selectedDog ? '' : 'border-gray-200'}`}
                        style={{ borderColor: selectedDog ? '#AD46FF' : undefined }}
                    >
                      <div className="w-full text-center px-4 py-4 bg-[#F9FAFB] ">
                        <span className="font-helvetica text-[24px] font-bold text-[#461799]">DOG</span>
                      </div>
                      <div className="w-full flex-1 overflow-hidden rounded-b-[12px]">
                        <img src={'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800'} alt="Dog" className="w-full h-full object-cover" />
                      </div>
                      {selectedDog && <span className="absolute top-2 right-2 text-green-500 text-2xl font-bold">✔</span>}
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default QuizTypeFigmaQuestion;
