import Link from "next/link";

interface DisplaySingleProjectProps {
  projectName: string;
  dateSubmitted: string;
  projectDeadline: string;
  projectDescription: string;
  projectAdditionalInfo: string;
  projectScenes: { sceneName: string; sceneId: string }[];
}

export default function DisplaySingleProject(props: DisplaySingleProjectProps) {
  return (
    <div className="fixed inset-0 flex h-screen w-screen justify-end bg-[#5F5F5FB2] p-[60px]">
      <div className="h-full w-1/2 overflow-auto rounded-xl bg-white pb-[20px] xl:w-2/5">
        <div className="flex w-full items-center pt-[28px]">
          <div className="font-afacad w-3/4 pl-[38px] text-3xl font-semibold">
            Project Details
          </div>
          <div className="font-afacad flex w-1/4 justify-end pr-[20px] text-4xl font-bold">
            <Link href={"/dashboard/projects"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M25.3033 14.6966L20 19.9999M20 19.9999L14.6967 25.3032M20 19.9999L25.3033 25.3032M20 19.9999L14.6967 14.6966M35 10.625L35 29.375C35 32.4816 32.4816 35 29.375 35H10.625C7.5184 35 5 32.4816 5 29.375V10.625C5 7.51838 7.5184 5 10.625 5H29.375C32.4816 5 35 7.51838 35 10.625Z"
                  stroke="#A3A3A3"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="pt-[30px]">
          <div className="h-[1px] w-full bg-[#D9D9D9]"></div>
        </div>
        <div className="pl-[38px] pr-[38px]">
          <div className="font-afacad pt-[15px] text-2xl font-semibold">
            {props.projectName}
          </div>
          <div className="flex pt-[10px]">
            <div className="font-afacad w-1/2 text-xl font-normal text-[#7D7C7C]">
              Date Submitted
            </div>
            <div className="font-afacad w-1/2 text-right text-xl font-normal text-black">
              {props.dateSubmitted}
            </div>
          </div>
          <div className="flex pt-[10px]">
            <div className="font-afacad w-1/2 text-xl font-normal text-[#7D7C7C]">
              Project Deadline
            </div>
            <div className="font-afacad w-1/2 text-right text-xl font-normal text-black">
              {props.projectDeadline}
            </div>
          </div>
          <div className="font-afacad pt-[30px] text-2xl font-semibold">
            Description
          </div>
          <div className="font-afacad pt-[8px] text-xl font-normal">
            {props.projectDescription}
          </div>
          <div className="font-afacad pt-[20px] text-2xl font-semibold">
            More about the project
          </div>
          <div className="font-afacad pt-[8px] text-xl font-normal">
            {props.projectAdditionalInfo}
          </div>
          <div className="font-afacad pb-[8px] pt-[20px] text-2xl font-semibold">
            Scenes
          </div>
          <div className="grid grid-cols-2 gap-4">
            {props.projectScenes.map((scene) => {
              return (
                <Link
                  key={scene.sceneId}
                  href={`/new-matching/${scene.sceneId}`}
                  className="flex h-[40px] items-center justify-start space-x-2 rounded-md bg-[#D9D9D9] pl-[10px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="31"
                    viewBox="0 0 24 25"
                    fill="none"
                  >
                    <path
                      d="M13.1667 3.24805V7.74805C13.1667 8.36937 13.689 8.87305 14.3333 8.87305H19M13.3668 3.24805H7.33333C6.04467 3.24805 5 4.25541 5 5.49805V18.998C5 20.2407 6.04467 21.248 7.33333 21.248H16.6667C17.9553 21.248 19 20.2407 19 18.998V8.68003C19 8.08329 18.7542 7.51099 18.3166 7.08904L15.0168 3.90706C14.5792 3.4851 13.9857 3.24805 13.3668 3.24805Z"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="font-afacad text-base text-lg font-medium">
                    {scene.sceneName}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
