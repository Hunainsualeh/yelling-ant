type WrongAnswerNoticeProps = {
  message?: string;
};

export default function WrongAnswerNotice({ message = 'That was incorrect.' }: WrongAnswerNoticeProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#B60000] bg-[#B600001A] p-4 min-h-[88px]">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B60000] text-white mr-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="#B60000" />
          <path d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[#B60000] font-helvetica text-[18px] font-normal">{message}</span>
    </div>
  );
}
