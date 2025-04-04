"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";

export default function Nav() {
  const [user] = trpc.user.useSuspenseQuery();
  const signOutMutation = trpc.signOut.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-12">
            <Image
              src="/icons/Minimalist Logo.svg"
              alt="good-dog-logo"
              width={48}
              height={48}
            />
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400"></div>
          </div>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-white transition hover:text-emerald-400"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white transition hover:text-emerald-400"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-white transition hover:text-emerald-400"
            >
              Gallery
            </Link>
            <Link
              href="/project-submission"
              className="rounded bg-zinc-800 px-6 py-2 text-white transition hover:bg-zinc-700 hover:text-emerald-400"
            >
              Submit
            </Link>
          </nav>

          <Link
            href={user ? "/account" : "/login"}
            className="text-emerald-400 transition hover:text-emerald-300"
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
      <div className="h-px bg-emerald-400"></div>
    </header>
  );
}

//   return (
//     <header className="bg-black text-white">
//       <div className="container mx-auto flex items-center justify-between px-4 py-6">
//         <Link href="/" className="flex items-center">
//           <div className="relative h-12 w-12">
//             <Image
//               src="/placeholder.svg?height=48&width=48"
//               alt="Logo"
//               width={48}
//               height={48}
//               className="fill-emerald-400 text-emerald-400"
//             />
//             <div className="absolute inset-0 rounded-full border-2 border-emerald-400"></div>
//           </div>
//         </Link>

//         <div className="flex items-center gap-8">
//           <nav className="hidden items-center gap-8 md:flex">
//             <Link
//               href="/"
//               className="text-white transition hover:text-emerald-400"
//             >
//               Home
//             </Link>
//             <Link
//               href="/about"
//               className="text-white transition hover:text-emerald-400"
//             >
//               About
//             </Link>
//             <Link
//               href="/gallery"
//               className="text-white transition hover:text-emerald-400"
//             >
//               Gallery
//             </Link>
//             <Link
//               href="/submit"
//               className="rounded bg-zinc-800 px-6 py-2 text-white transition hover:bg-zinc-700 hover:text-emerald-400"
//             >
//               Submit
//             </Link>
//           </nav>

//           <button className="text-emerald-400 transition hover:text-emerald-300">
//             <User className="h-6 w-6" />
//           </button>
//         </div>
//       </div>
//       <div className="h-px bg-emerald-400"></div>
//     </header>
//   );
// }

//   return (
//     <nav className="items-center bg-good-dog-violet px-9 py-12 font-righteous font-semibold">
//       <ul className="flex flex-row justify-between text-white">
//         <li>
//           <Link href="/">
//             <Image
//               src="/icons/Minimalist Logo.svg"
//               width={64}
//               height={64}
//               alt="good-dog-logo"
//             />
//           </Link>
//         </li>
//         <div className="flex flex-row items-center space-x-16">
//           <li>
//             <Link href="/about">ABOUT US</Link>
//           </li>
//           {user ? (
//             <>
//               <li>
//                 <Link href="/account">ACCOUNT</Link>
//               </li>
//               <li>
//                 <button
//                   onClick={() => {
//                     signOutMutation.mutate();
//                   }}
//                 >
//                   LOGOUT
//                 </button>
//               </li>
//             </>
//           ) : (
//             <li>
//               <Link href="/login">LOGIN</Link>
//             </li>
//           )}
//           <Link href="/submit">
//             <li className="rounded-full bg-good-dog-celadon px-4 py-1 text-good-dog-violet">
//               SUBMIT
//             </li>
//           </Link>
//         </div>
//       </ul>
//     </nav>
//   );
