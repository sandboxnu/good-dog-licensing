import Image from "next/image";
import Link from "next/link";

export default function LandingSubmission({
  flipX = false,
  flipY = false,
  reverseLayout = false,
  title = "Media Makers",
  description = "Music can be one of the most powerful tools a storyteller can use. Here at Good Dog Licensing, we offer the extremely unique opportunity to license top quality music for no cost whatsoever! Beyond licensing, Good Dog will also conduct thorough music searches for you and assist you with all things music supervision making the whole process of obtaining music seamless and easy! Whether you’re working on a film, video game, podcast, or anything at all Good Dog is there to help you.",
  button = "SUBMIT A BRIEF",
}) {
  const imageFlipClasses = `
    ${flipX ? "scale-x-[-1]" : ""}
    ${flipY ? "scale-y-[-1]" : ""}
  `;

  return (
    <div
      style={{ paddingBottom: "7rem" }}
      className={`flex flex-row ${reverseLayout ? "flex-row-reverse" : ""}`}
    >
      <Image
        src="/bg-assets/green-rectangle-cut.svg"
        alt="green-rectangle"
        width={597}
        height={492}
        className={imageFlipClasses}
      />
      <div className="grid justify-items-start px-24 pt-24">
        <h1 className="text-good-dog-pale-yellow font-righteous text-5xl">
          {title}
        </h1>
        <p className="pt-8 text-white">{description}</p>
        <div className="pt-12">
          <Link href="/submit">
            <div
              className="bg-good-dog-celadon text-good-dog-violet rounded-full px-4 py-1 font-righteous font-semibold"
              style={{ width: "fit-content" }}
            >
              {button}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
