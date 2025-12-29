// Logo Header Component
const LogoHeader = () => {
  return (
    <div className="w-full bg-white py-[28px]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-center">
        <div className="flex flex-col items-center max-w-full">
          <img
            src="/Logo.svg"
            alt="Yelling Ant Logo"
            className="w-full max-w-[664px] h-auto object-contain mb-2"
          />

        </div>
      </div>
    </div>
  );
};

export default LogoHeader;