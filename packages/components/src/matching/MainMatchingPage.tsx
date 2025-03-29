export default function MainMatchingPage() {
  return (
    <div className="flex h-screen w-screen bg-[#DEE0E2] px-[80px] py-[60px]">
      <div className="w-1/2 bg-white">
        <div className="pl-[33px] pt-[24]">
          <button className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M15 6L9 12L15 18" stroke="#333333" />
            </svg>
            <div className="font-afacad text-base font-normal text-black">
              Project Name
            </div>
          </button>
        </div>
        <div className="font-afacad pl-[58px] pt-[26px] text-3xl font-semibold text-black">
          Scene
        </div>
        <div className="px-[50px] pt-[29px]">
          <div className="h-[0.5px] w-full bg-[#A3A3A3]"></div>
        </div>
      </div>
      <div className="w-1/2 bg-[#EDF3F9]">Test</div>
    </div>
  );
}
