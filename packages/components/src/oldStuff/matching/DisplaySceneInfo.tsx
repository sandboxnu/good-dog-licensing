// import Link from "next/link";

// interface DisplaySceneInfoProps {
//   projectId: string;
//   projectTitle: string;
//   sceneTitle: string;
//   description: string;
//   musicType: string;
//   similarSongs: string;
//   additionalInfo: string;
// }

// export default function DisplaySceneInfo(props: DisplaySceneInfoProps) {
//   return (
//     <div className="w-1/2 overflow-y-auto bg-white">
//       <div className="pl-[33px] pt-[24]">
//         <Link
//           href={`/dashboard/projects?id=${props.projectId}`}
//           className="flex"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//           >
//             <path d="M15 6L9 12L15 18" stroke="#333333" />
//           </svg>
//           <div className="font-afacad text-base font-normal text-black">
//             {props.projectTitle}
//           </div>
//         </Link>
//       </div>
//       <div className="font-afacad pl-[58px] pt-[26px] text-3xl font-semibold text-black">
//         Scene
//       </div>
//       <div className="px-[50px] pt-[29px]">
//         <div className="h-[0.5px] w-full bg-[#A3A3A3]"></div>
//       </div>
//       <div className="font-afacad pl-[57px] pt-[14px] text-2xl font-medium text-black">
//         Scene Name
//       </div>
//       <div className="font-afacad pl-[57px] pt-[4px] text-lg font-normal text-black">
//         {props.sceneTitle}
//       </div>
//       <div className="px-[50px] pt-[14px]">
//         <div className="h-[0.5px] w-full bg-[#A3A3A3]"></div>
//       </div>
//       <div className="font-afacad pl-[57px] pt-[19px] text-2xl font-medium text-black">
//         Description
//       </div>
//       <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
//         {props.description}
//       </div>
//       <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
//         Type of Music Needed
//       </div>
//       <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
//         {props.musicType}
//       </div>
//       <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
//         Similar Types of Songs
//       </div>
//       <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
//         {props.similarSongs}
//       </div>
//       <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
//         Additional Info
//       </div>
//       <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
//         {props.additionalInfo}
//       </div>
//     </div>
//   );
// }
