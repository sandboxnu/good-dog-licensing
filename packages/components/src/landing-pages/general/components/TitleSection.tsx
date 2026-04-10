import DownArrow from "../../../svg/DownArrow";

export default function TitleSection() {
  return (
    <div>
      <h1 className="font-righteous text-[40px] font-normal leading-tight text-dark-gray-500 dark:text-mint-300 md:text-[72px] md:leading-[80px]">
        Connecting musicians and media makers
      </h1>
      <p className="mt-[16px] text-center text-[20px] font-medium leading-[104%] text-dark-gray-500 dark:text-gray-300 md:text-[35px]">
        Northeastern University's free, student-run music synchronization
        service.
      </p>
      <h2 className="mt-[40px] text-center text-[28px] font-medium leading-[96%] text-green-400 dark:text-mint-200 md:text-[48px]">
        Say "Yes" to Licensing!
      </h2>
      <div className="mt-[16] flex items-center justify-center">
        <DownArrow />
      </div>
    </div>
  );
}
