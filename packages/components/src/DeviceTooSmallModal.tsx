import DeviceTooSmallSvg from "./svg/DeviceTooSmallSvg";

export default function DeviceTooSmallModal() {
  return (
    <div className="w-full rounded-[16px] bg-white">
      <div className="flex flex-col items-center gap-[16px] px-[24px] py-[30px] text-center">
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
