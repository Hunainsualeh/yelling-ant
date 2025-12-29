interface ProgressIndicatorProps {
  value?: number;
  current?: number;
}

const ProgressIndicator = ({ value = 42, current = 8 }: ProgressIndicatorProps) => {
  return (
    <div className="flex w-full max-w-[798px] mx-auto h-[41px] flex-col items-start justify-center gap-2 pl-0 pr-[100px] pt-[5px] pb-6 -translate-y-4 animate-fade-in opacity-0 [--animation-delay:600ms]">
      <div className="absolute w-full max-w-[798px] top-[5px] left-0 h-3 bg-[#f0dcff] opacity-20 rounded-[100px]" />

      <div className="relative self-stretch w-full h-3 bg-[#4B2E83] rounded-[100px]" style={{ width: `${value}%` }}>
        <div className="absolute top-[calc(50%-8px)] -right-0.5 w-4 h-4">
          <div className="absolute top-[calc(50%-7px)] -right-px w-3.5 h-3.5 bg-white rounded-[7px] border border-solid border-[#0000001a] shadow-[0px_2px_4px_#0000001a]" />

          <div className="absolute right-[-7px] bottom-[15px] w-[26px] h-6 flex items-center justify-center rounded bg-gradient-to-r from-[#ff8904] to-[#fdc700]">
            <div className="flex items-center justify-center mt-[-3px] h-[15px] -ml-px w-2 font-['Helvetica','Arial',sans-serif] font-normal text-white text-xs text-center tracking-[0] leading-[normal]">
              {current}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
