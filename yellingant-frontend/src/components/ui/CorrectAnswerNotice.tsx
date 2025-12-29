type CorrectAnswerNoticeProps = {
  message?: string;
};

export default function CorrectAnswerNotice({ message = 'Correct!' }: CorrectAnswerNoticeProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#10B981] bg-[#ECFDF5] p-4 min-h-[88px]">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10B981] text-white mr-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="#10B981" />
          <path d="M6 10.5l2.5 2.5L14 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[#065f46] font-helvetica text-[18px] font-normal">{message}</span>
    </div>
  );
}
