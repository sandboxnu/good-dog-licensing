export default function MusicianPanelItem() {
  return (
    <div className="h-[285px] w-[485px] rounded-xl bg-good-dog-black text-center text-white">
      <div className="pl-[50px] pt-[50px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="52"
          viewBox="0 0 46 52"
          fill="none"
        >
          <path
            d="M46 8.3216V20.8011C45.998 21.1237 45.9216 21.4415 45.7765 21.73C45.6315 22.0185 45.4218 22.27 45.1636 22.4651C44.9007 22.6585 44.5968 22.7895 44.2752 22.8481C43.9535 22.9067 43.6227 22.8913 43.308 22.8031L25.0909 17.3693V39.5205C25.0909 41.9887 24.3551 44.4015 22.9766 46.4537C21.5981 48.506 19.6388 50.1055 17.3464 51.05C15.054 51.9946 12.5315 52.2417 10.098 51.7602C7.66438 51.2787 5.429 50.0901 3.67448 48.3448C1.91997 46.5995 0.725132 44.3759 0.241063 41.9551C-0.243006 39.5343 0.00543576 37.0251 0.954971 34.7447C1.90451 32.4644 3.51249 30.5154 5.57558 29.1441C7.63867 27.7728 10.0642 27.0409 12.5455 27.0409C15.6368 27.0315 18.62 28.1722 20.9091 30.2388V2.08183C20.9111 1.75928 20.9875 1.44151 21.1326 1.15301C21.2776 0.864512 21.4873 0.613004 21.7455 0.417888C22.0084 0.224464 22.3123 0.0934457 22.6339 0.0348625C22.9555 -0.0237207 23.2864 -0.0083152 23.6011 0.0799004L44.5102 6.31967C44.9403 6.45238 45.3166 6.71805 45.5845 7.07806C45.8524 7.43807 45.998 7.87368 46 8.3216Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="font-afacad pl-[40px] pt-[25px] text-left text-[35px] font-semibold text-white">
        Musicians
      </div>
      <div className="font-afacad pl-[40px] pr-[75px] pt-[15px] text-left text-[25px] font-semibold leading-[30px] text-good-dog-gray">
        Synchronizing your music is a great way to reach greater audiences
      </div>
    </div>
  );
}
