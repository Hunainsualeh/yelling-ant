import React from 'react';

type MonthOption = {
  label: string;
  value: string;
};

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  options?: MonthOption[];
  className?: string;
};

const defaultOptions: MonthOption[] = [
  { label: 'October', value: '30' },
  { label: 'November', value: '90' },
  { label: 'December', value: '180' },
  { label: 'January', value: '365' },
];

export const MonthSelect: React.FC<Props> = ({ value, onChange, options = defaultOptions, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={className}>
      <label className="sr-only">Select month range</label>
      <div className="relative inline-block text-center">
        <select
          value={value}
          onChange={handleChange}
          className="appearance-none bg-[#D5D5D5] rounded-md py-2 pl-3 pr-8 font-helvetica font-normal border border-gray-200 text-[12px] leading-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MonthSelect;
