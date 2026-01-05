import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  title?: string;
  questions?: number;
  completions?: number;
  percent?: number; // 0-100
  isCreate?: boolean;
};

const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="w-full bg-[#E6E6E6] h-2 rounded-full overflow-hidden">
    <div className="h-2 bg-[#7C3AED]" style={{ width: `${percent}%` }} />
  </div>
);

const PerformanceCard: React.FC<Props> = ({ title = '', questions = 0, completions = 0, percent = 0, isCreate = false }) => {
  if (isCreate) {
    const navigate = useNavigate();
    return (
      <div className="h-full">
        <button
          onClick={() => navigate('/admin/create')}
          className="box-border flex flex-col justify-center items-center py-[34px] px-[13px] gap-2 w-full h-[160px] border border-dashed border-[#C85103] rounded-lg bg-white hover:bg-orange-50 transition-colors"
          type="button"
        >
          <div className="flex flex-col items-center gap-[15px]">
            {/* Orange circle with plus */}
            <div className="w-8 h-8 rounded-full bg-[#C85103] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Text content */}
            <div className="flex flex-col items-center gap-2">
              <span className="font-helvetica font-normal text-[16px] leading-[18px] text-center text-[#2B2B2B]">
                Create New Quiz
              </span>
              <span className="font-helvetica font-normal text-[12px] leading-[14px] text-center text-[#696F79]">
                Add questions, set time limits and more
              </span>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="bg-[#FAFAFA] rounded-lg p-4 h-[160px] flex flex-col justify-between shadow-sm">
        <div>
          <div className="text-[16px] font-helvetica font-bold text-black">{title}</div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-[#696F79] text-[14px] font-helvetica font-normal">
              <span>📚</span>
              <span>{questions} questions</span>
            </div>
            <div className="flex items-center gap-2 text-[#696F79] text-[14px] font-helvetica font-normal">
              <span>👥</span>
              <span>{completions} completions</span>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[#2B2B2B] text-[12px] font-helvetica font-normal">Completion Rate</div>
            <div className="text-[#696F79] text-[14px] font-helvetica font-normal">{percent}%</div>
          </div>
          <ProgressBar percent={percent} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;
