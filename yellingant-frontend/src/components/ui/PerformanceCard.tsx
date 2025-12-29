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
          className="w-full h-[160px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50"
          type="button"
        >
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto mb-3">+</div>
            <div className="text-[14px] font-helvetica font-normal text-black">Create New Quiz</div>
            <div className="text-[12px] font-helvetica font-normal text-[#696F79]">Add questions, set time limits and more</div>
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
