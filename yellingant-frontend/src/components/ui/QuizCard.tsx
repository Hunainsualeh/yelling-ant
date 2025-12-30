import { Play } from './Icons.tsx';
import { Link } from 'react-router-dom';
import { getQuizBySlug } from '../../quiz/data/quizzes';

interface QuizCardProps {
  image: string;
  title: string;
  subtitle?: string;
  views: string;
  badge?: string;
  className?: string;
  slug?: string;
  showTypePill?: boolean;
}

const QuizCard = ({ image, title, subtitle, views, badge, className = '', slug = 'what-kind-of-person-are-you', showTypePill = true }: QuizCardProps) => {
  const resolved = slug ? getQuizBySlug(slug) : undefined;
  const quizType = resolved?.type;

  return (
    <div
      className={`w-full max-w-[324.33px] h-auto min-h-[429.25px] rounded-[24px] border-[4px] border-[#fff] bg-white opacity-100 p-1 shadow-[0_4px_15px_0px_#ABABAB1A] flex flex-col ${className}`}
    >
      {/* Image Container */}
      <Link
        to={`/quiz/${slug}`}
        className="block relative w-full h-[237.24px] mx-auto rounded-t-[20px] rounded-b-none overflow-hidden"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {(badge === 'Easy' || badge === 'Medium') && (
          <div className="absolute top-[12px] right-[12px] flex items-center justify-center">
            <span className="bg-[#000000B2] rounded-full px-4 h-[24px] flex items-center font-helvetica font-normal text-[12px] leading-[16px] text-white whitespace-nowrap">
              {badge}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="w-full h-auto flex flex-col gap-[12px] pt-5 px-5 mx-auto flex-grow">
        <div className="flex items-start gap-2">
          {quizType === 'personality' && showTypePill && (
            <span className="text-[12px] bg-[#AD46FF] text-white rounded-full px-3 py-1 leading-[18px] font-helvetica">Personality</span>
          )}
          <Link to={`/quiz/${slug}`} className="flex-1">
            <h3 className="font-helvetica font-normal text-[18px] leading-[28px] tracking-[-0.44px] text-[#101828] w-full mb-0 line-clamp-2">
              {title}
            </h3>
          </Link>
        </div>
        {subtitle && (
          <p className="font-helvetica font-normal text-[14px] leading-[20px] tracking-[-0.15px] text-[#696F79] w-full mt-[0.5px] line-clamp-1">
            {subtitle}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pb-4">
          <div className="flex items-center gap-2 text-[#696F79] font-helvetica font-normal text-[14px] leading-[20px] tracking-[-0.15px] w-auto mt-[0.5px] whitespace-nowrap">
            <Play className="w-4 h-4 text-[#99A1AF] stroke-[#6A7282] stroke-[1.33px]" />
            <span>{views}</span>
          </div>
          <Link
            to={`/quiz/${slug}`}
            className="w-auto min-w-[94.98px] h-[36px] rounded-[6px] border border-[#AD46FF] bg-white flex items-center justify-center px-3 py-0"
          >
            <span className="tracking-[-0.15px] whitespace-normal">
              <span className="text-[#AD46FF] text-center font-helvetica font-normal text-[14px] leading-[20px] w-full">Take Quiz</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
