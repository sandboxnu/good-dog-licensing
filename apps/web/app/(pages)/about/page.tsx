import Image from "next/image";

import MediaMusicianAbout from "@good-dog/components/MediaMusicianAbout";

const InitialHeader = () => {
  return (
    <div className="px-9">
      <div className="font-righteous pt-6 text-7xl text-good-dog-celadon">
        ABOUT US
      </div>
      <div className="font-afacad text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra
        lacus sit amet turpis suscipit, eget convallis elit condimentum. Etiam
        ac tortor ac lectus scelerisque mollis. Fusce tempus ornare rutrum.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Cras congue, orci molestie euismod mollis,
        sapien nisi aliquet diam, vitae porta augue lacus eget elit. Mauris diam
        diam.
      </div>
      <div className="font-afacad pt-6 text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra
        lacus sit amet turpis suscipit, eget convallis elit condimentum. Etiam
        ac tortor ac lectus scelerisque mollis. Fusce tempus ornare rutrum.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Cras congue, orci molestie euismod mollis,
        sapien nisi aliquet diam, vitae porta augue lacus eget elit. Mauris diam
        diam.
      </div>
    </div>
  );
};

const FurtherInfo = () => {
  return (
    <div className="flex flex-row pt-24">
      <div className="px-9">
        <div>
          <div className="font-righteous pt-6 text-4xl text-good-dog-celadon">
            What makes GOOD DOG "GOOD"?
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
        </div>
        <div>
          <div className="font-righteous pt-12 text-4xl text-lg text-good-dog-celadon">
            Connecting Creatives
          </div>
          <div className="font-afacad pt-6 text-white">
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

export default function AboutUs() {
  return (
    <main className="bg-good-dog-violet">
      <InitialHeader />
      <FurtherInfo />
      <MediaMusicianAbout />
    </main>
  );
}
