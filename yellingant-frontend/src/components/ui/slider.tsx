import { type JSX } from "react";

interface Props {
  className: any;
}

export const Slider = ({ className }: Props): JSX.Element => {
  return (
    <div
      className={`flex flex-col w-[798px] items-start justify-center gap-2 pl-0 pr-[100px] pt-[5px] pb-6 relative top-[1124px] left-[131px] ${className}`}
    >
      <div className="absolute w-full top-[5px] left-0 h-3 bg-[#efdcff] rounded-[100px] opacity-20" />

      <div className="relative self-stretch w-full h-3 bg-[#ff8803] rounded-[100px]">
        <div className="absolute top-[calc(50.00%_-_8px)] -right-0.5 w-4 h-4 aspect-[1]">
          <div className="absolute top-[calc(50.00%_-_7px)] -right-px w-3.5 h-3.5 bg-white rounded-[7px] border border-solid border-[#0000001a] shadow-[0px_2px_4px_#0000001a]" />

          <div className="absolute right-[-7px] bottom-[15px] w-[26px] h-6 flex items-center justify-center rounded bg-[url(/bg.svg)] bg-[100%_100%]">
            <div className="flex items-center justify-center mt-[-3px] h-[15px] -ml-px w-2 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[normal]">
              8
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
