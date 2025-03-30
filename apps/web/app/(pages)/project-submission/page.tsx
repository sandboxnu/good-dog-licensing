import Image from "next/image";
import Link from "next/link";

import FinalProjSubmission from "@good-dog/components/projectSubmission/finalProjSubmission";
import ProjectSubmission from "@good-dog/components/projectSubmission/projectSubmission";
import ProjectSubmissionForm from "@good-dog/components/projectSubmission/projectSubmissionForm";
import SceneSubmission from "@good-dog/components/projectSubmission/sceneSubmission";
//import { Twitter, Mail, Instagram, Facebook, Youtube, User } from "lucide-react"
import { Button } from "@good-dog/ui/button";

export default function SubmissionForm() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-12">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="fill-emerald-400 text-emerald-400"
                />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400"></div>
              </div>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/"
                className="text-white transition hover:text-emerald-400"
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="text-white transition hover:text-emerald-400"
              >
                About Us
              </Link>
              <Link
                href="/projects"
                className="text-white transition hover:text-emerald-400"
              >
                Projects
              </Link>
              <Link
                href="/submit"
                className="rounded bg-zinc-800 px-4 py-1.5 text-white transition hover:bg-zinc-700"
              >
                Submit
              </Link>
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-400 hover:bg-transparent hover:text-emerald-300"
            ></Button>
          </div>
        </nav>
      </header>

      {/* Divider */}
      <div className="h-px w-full bg-emerald-400"></div>
      <ProjectSubmissionForm />

      {/* <ProjectSubmission /> */}

      {/* Divider */}
      {/* <div className="h-px w-full bg-emerald-400"></div>
      <SceneSubmission />
      <div className="h-px w-full bg-emerald-400"></div>
      <FinalProjSubmission /> */}
      {/* Footer */}
      {/* <footer className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-8 mb-6 md:mb-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
            >
              <Mail className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
            >
              <Instagram className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
            >
              <Youtube className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative w-12 h-12">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="Logo"
              width={48}
              height={48}
              className="text-emerald-400 fill-emerald-400"
            />
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400"></div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
