// "use client";

// import { useState } from "react";
// import Link from "next/link";

// import { trpc } from "@good-dog/trpc/client";

// import DisplayComments from "./DisplayComments";

// interface MatchedSongProps {
//   songName: string;
//   artistName: string;
//   musicId: string;
//   projectId: string;
//   sceneId: string;
//   isMatched: boolean;
//   handleMatch: (musicId: string) => Promise<void>;
//   matchId: string;
//   userId: string;
//   handleComment: () => Promise<void>;
//   comments: {
//     commentText: string;
//     userName: string;
//     timestamp: string;
//     commentId: string;
//   }[];
//   genres: string;
//   songLink: string;
// }

// export default function MatchedSong(props: MatchedSongProps) {
//   const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);

//   const createMatchMutation = trpc.suggestMatch.useMutation({
//     onSuccess: async () => {
//       await props.handleMatch(props.musicId);
//     },
//     onError: (err) => {
//       //TODO - Display error
//       console.error(err);
//     },
//   });

//   const createMatch = () => {
//     createMatchMutation.mutate({
//       projectId: props.projectId,
//       sceneId: props.sceneId,
//       musicId: props.musicId,
//       description: "",
//     });
//   };

//   return (
//     <>
//       <div className="flex min-h-[60px] w-full items-center rounded-xl bg-white">
//         <div className="font-afacad w-1/2 pl-[20px] text-xl font-normal text-black">
//           {'"' + props.songName + '" by ' + props.artistName}
//         </div>
//         <div className="w-1/4 pl-[20px]">
//           {!props.isMatched && (
//             <button
//               onClick={createMatch}
//               className="font-afacad w-[75px] rounded-xl border-[1px] border-[#015643] text-center text-lg font-normal"
//             >
//               Match
//             </button>
//           )}
//           {props.isMatched && (
//             <div className="font-afacad w-[100px] rounded-xl border-[1px] border-[#015643] bg-[#015643] text-center text-lg font-normal text-white">
//               Matched
//             </div>
//           )}
//         </div>
//         <div className="flex w-1/4 justify-end pr-[20px]">
//           <button
//             onClick={() => {
//               setShowMoreDetails(!showMoreDetails);
//             }}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="26"
//               height="24"
//               viewBox="0 0 26 24"
//               fill="none"
//             >
//               <path d="M7.13086 9L13.3764 15L19.622 9" stroke="#333333" />
//             </svg>
//           </button>
//         </div>
//       </div>
//       {showMoreDetails && (
//         <div className="w-full rounded-xl bg-[#D9D9D9]">
//           <div className="flex items-center pt-[20px]">
//             <div className="font-afacad w-1/6 pl-[34px] text-xl font-normal text-black">
//               Name:
//             </div>
//             <div className="font-afacad w-5/6 pl-[50px] text-lg font-normal">
//               {props.songName}
//             </div>
//           </div>
//           <div className="flex items-center pt-[15px]">
//             <div className="font-afacad w-1/6 pl-[34px] text-xl font-normal text-black">
//               Artist:
//             </div>
//             <div className="font-afacad w-5/6 pl-[50px] text-lg font-normal">
//               {props.artistName}
//             </div>
//           </div>
//           <div className="flex items-center pt-[15px]">
//             <div className="font-afacad w-1/6 pl-[34px] text-xl font-normal text-black">
//               Genres:
//             </div>
//             <div className="font-afacad w-5/6 pl-[50px] text-lg font-normal">
//               {props.genres}
//             </div>
//           </div>
//           <div className="flex items-center pt-[15px]">
//             <div className="font-afacad w-1/6 pl-[34px] text-xl font-normal text-black">
//               Link:
//             </div>
//             <div className="w-5/6 pl-[50px]">
//               <Link
//                 href={props.songLink}
//                 target="_blank"
//                 className="font-afacad flex w-[100px] items-center justify-center rounded-xl border-[1px] border-[#A3A3A3] text-lg font-normal"
//               >
//                 Song Link
//               </Link>
//             </div>
//           </div>
//           {props.isMatched && (
//             <DisplayComments
//               handleComment={props.handleComment}
//               comments={props.comments}
//               matchId={props.matchId}
//               userId={props.userId}
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// }
