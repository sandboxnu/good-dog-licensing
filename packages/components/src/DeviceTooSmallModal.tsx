import DeviceTooSmallSvg from "./svg/DeviceTooSmallSvg";

export default function DeviceTooSmallModal() {
  return (
    <div className="bg-white rounded-[16px] w-full">
      <div className="px-[24px] py-[30px] flex flex-col items-center text-center gap-[16px]">
        <DeviceTooSmallSvg />
        <div className="text-h3 font-semibold">Device Too Small</div>
        <div className="text-body2 font-normal">
          We cannot accommodate devices this small at the moment. Please use a
          larger device. We apologize for the inconvenience.
        </div>
      </div>
    </div>
  );
}
