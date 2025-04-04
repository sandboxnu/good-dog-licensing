import Image from "next/image";
import Link from "next/link";

import ProjectSubmissionForm from "@good-dog/components/projectSubmission/projectSubmissionForm";
//import { Twitter, Mail, Instagram, Facebook, Youtube, User } from "lucide-react"
import { Button } from "@good-dog/ui/button";

export default function SubmissionForm() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
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
