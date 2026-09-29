import { MoveDown } from "lucide-react";

export default function TitleSection() {
  return (
    <div>
      <h1 className="font-righteous text-[40px] leading-tight font-normal text-dark-gray-500 md:text-[60px] md:leading-[80px] lg:text-[72px] dark:text-mint-300">
        Connecting musicians and media makers
      </h1>
      <p className="mt-[16px] text-center text-[25px] leading-[104%] font-medium text-dark-gray-500 md:text-[30px] lg:text-[35px] dark:text-gray-300">
        Northeastern University's free, student-run music synchronization
        service.
      </p>
      <h2 className="mt-[40px] text-center text-[25px] leading-[96%] font-medium text-green-400 md:text-[35px] lg:text-[48px] dark:text-mint-200">
        Say "Yes" to Licensing!
      </h2>
      <div className="mt-[16px] flex items-center justify-center">
        <MoveDown className="h-20 w-20 text-green-400 dark:text-mint-300" />
      </div>
    </div>
  );
}
