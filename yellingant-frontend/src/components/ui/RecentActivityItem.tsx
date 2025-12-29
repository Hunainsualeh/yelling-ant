import React from 'react';

type Props = {
  title: string;
  typeLabel?: string; // e.g. 'Personality', 'Trivia'
  status?: string; // e.g. 'Published' | 'Draft'
  plays?: string | number;
};

const RecentActivityItem: React.FC<Props> = ({ title, typeLabel, status, plays }) => {
  return (
    <div className="p-3 rounded-lg bg-gray-50 flex items-center justify-between">
      <div>
        <div className="font-helvetica text-[16px] text-[#202224] font-normal">{title}</div>
        <div className="flex items-center gap-3 mt-2">
          {typeLabel && <div className="font-helvetica font-normal text-[16px] text-gray-500">{typeLabel}</div>}
          {status && (
            <div className={`font-helvetica font-normal text-[14px] ${status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} px-2 py-0.5 rounded-md`}>{status}</div>
          )}
        </div>
      </div>

      <div className="font-helvetica font-normal text-[16px] text-[#696F79]">{plays ?? ''} plays</div>
    </div>
  );
};

export default RecentActivityItem;
