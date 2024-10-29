import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-good-dog-violet">
      <div style={{ paddingTop: "10vh", paddingBottom: "15rem" }}>
        <Image
          src="/icons/Good Dog With Logo.svg"
          width={789}
          height={0}
          alt="good-dog-logo"
          style={{ margin: "auto", display: "block", marginBottom: "2.5rem"}}
        />
        <div
          className="rounded-full bg-good-dog-celadon px-4 py-1 font-semibold text-good-dog-violet font-righteous"
          style={{ margin: "auto", width: "fit-content"}}
        >
          <a href="/submit">SUBMIT A BRIEF</a>
        </div>
      </div>
    </main>
  );
}
