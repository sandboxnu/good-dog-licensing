import Image from "next/image";

export default function LandingSubmission({
  flipX = false,
  flipY = false,
  reverseLayout = false,
  title = "Media Makers",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra lacus sit amet turpis suscipit, eget convallis elit condimentum. Etiam ac tortor ac lectus scelerisque mollis. Fusce tempus ornare rutrum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras congue, orci molestie euismod mollis, sapien nisi aliquet diam, vitae porta augue lacus eget elit. Mauris diam diam.",
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
        <h1 className="font-righteous text-5xl text-good-dog-pale-yellow">
          {title}
        </h1>
        <p className="pt-8 text-white">{description}</p>
        <div className="pt-12">
          <a href="/submit">
            <div
              className="rounded-full bg-good-dog-celadon px-4 py-1 font-righteous font-semibold text-good-dog-violet"
              style={{ width: "fit-content" }}
            >
              {button}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
