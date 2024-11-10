import Image from "next/image";

import MediaMusicianAbout from "@good-dog/components/MediaMusicianAbout";

export default function AboutUs() {
  const InitialHeader = () => {
    return (
      <div className="px-9">
        <div
          style={{
            paddingTop: "10vh",
            fontSize: "72px",
          }}
          className="font-righteous text-lg text-good-dog-celadon"
        >
          ABOUT US
        </div>
        <div className="font-afacad text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          pharetra lacus sit amet turpis suscipit, eget convallis elit
          condimentum. Etiam ac tortor ac lectus scelerisque mollis. Fusce
          tempus ornare rutrum. Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Cras congue, orci
          molestie euismod mollis, sapien nisi aliquet diam, vitae porta augue
          lacus eget elit. Mauris diam diam.
        </div>
        <div
          style={{
            paddingTop: "1.5vh",
          }}
          className="font-afacad text-white"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          pharetra lacus sit amet turpis suscipit, eget convallis elit
          condimentum. Etiam ac tortor ac lectus scelerisque mollis. Fusce
          tempus ornare rutrum. Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Cras congue, orci
          molestie euismod mollis, sapien nisi aliquet diam, vitae porta augue
          lacus eget elit. Mauris diam diam.
        </div>
      </div>
    );
  };

  const FurtherInfo = () => {
    return (
      <div
        className="flex flex-row"
        style={{
          paddingTop: "10vh",
        }}
      >
        <div className="px-9">
          <div>
            <div
              style={{
                fontSize: "48px",
                paddingTop: "4vh",
              }}
              className="font-righteous text-lg text-good-dog-celadon"
            >
              What makes GOOD DOG "GOOD"?
            </div>
            <div className="font-afacad text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              pharetra lacus sit amet turpis suscipit, eget convallis elit
              condimentum. Etiam ac tortor ac lectus scelerisque mollis. Fusce
              tempus ornare rutrum. Pellentesque habitant morbi tristique
              senectus et netus et malesuada fames ac turpis egestas. Cras
              congue, orci molestie euismod mollis, sapien nisi aliquet diam,
              vitae porta augue lacus eget elit. Mauris diam diam.
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "48px",
                paddingTop: "2vh",
              }}
              className="font-righteous text-lg text-good-dog-celadon"
            >
              Connecting creativity
            </div>
            <div className="font-afacad text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              pharetra lacus sit amet turpis suscipit, eget convallis elit
              condimentum.
            </div>
          </div>
        </div>

        <Image
          src="/images/pianoStockImage.png"
          alt="piano image"
          width={660}
          height={472}
          style={{ width: "660px", height: "472px" }}
        />
      </div>
    );
  };

  return (
    <main className="bg-good-dog-violet">
      <InitialHeader />
      <FurtherInfo />
      <MediaMusicianAbout />
    </main>
  );
}
