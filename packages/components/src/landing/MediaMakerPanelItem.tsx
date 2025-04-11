export default function MediaMakerPanelItem() {
  return (
    <div className="h-[285px] w-[485px] rounded-xl bg-good-dog-black text-center text-white">
      <div className="pl-[50px] pt-[50px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
        >
          <path
            d="M36.45 19.5417C36.45 17.2763 35.5611 15.1037 33.9787 13.5018C32.3964 11.8999 30.2503 11 28.0125 11H8.4375C6.19974 11 4.05362 11.8999 2.47129 13.5018C0.888948 15.1037 0 17.2763 0 19.5417V43.4583C0 45.7237 0.888948 47.8963 2.47129 49.4982C4.05362 51.1001 6.19974 52 8.4375 52H28.0125C30.2503 52 32.3964 51.1001 33.9787 49.4982C35.5611 47.8963 36.45 45.7237 36.45 43.4583V19.5417ZM36.45 37.2882L48.5473 46.4896C50.764 48.2417 54 46.6427 54 43.7973V19.2041C54 16.3573 50.764 14.7597 48.5473 16.5118L36.45 25.0686V37.2882Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="font-afacad pl-[40px] pt-[25px] text-left text-[35px] font-semibold text-white">
        Media Makers
      </div>
      <div className="font-afacad pl-[40px] pr-[75px] pt-[15px] text-left text-[25px] font-semibold leading-[30px] text-good-dog-gray">
        Set the mood and bring your stories to life by adding music
      </div>
    </div>
  );
}
