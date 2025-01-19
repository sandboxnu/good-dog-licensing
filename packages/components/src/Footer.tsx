import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-good-dog-celadon">
      <Image
        className="relative"
        src="/bg-assets/footer_checker.svg"
        alt="footer-checker"
        width={0}
        height={0}
        style={{ width: "100%", height: "auto" }}
      />
      <div className="flex flex-row content-center items-center justify-between px-12 pt-16 pb-4">
        <div className="absolute left-1/2 flex -translate-x-1/2 transform space-x-4">
          <Link href="https://x.com/gdlicensing">
            <Image
              src="/icons/twitter_icon.svg"
              width={70}
              height={70}
              alt="good-dog-twitter"
            />
          </Link>
          <Link href="https://www.instagram.com/gooddoglicensing/">
            <Image
              src="/icons/instagram_icon.svg"
              width={70}
              height={70}
              alt="good-dog-instagram"
            />
          </Link>
          <Link href="mailto:gooddoglicensing@gmail.com">
            <Image
              src="/icons/email_icon.svg"
              width={70}
              height={70}
              alt="good-dog-email"
            />
          </Link>
        </div>
        <Link href="/">
          <Image
            src="/icons/Dark Mode Logo.svg"
            width={120}
            height={120}
            alt="good-dog-logo"
          />
        </Link>
      </div>
      <div className="text-[#0D0039] text-center pb-4 text-lg">
        <p>Operated by&nbsp;
          <a className="underline" href="https://www.greenlinerecords.com/">Green Line Records</a>
        </p>
        <p className="text-center text-lg">Made by students @&nbsp;
          <a className="underline" href="https://www.sandboxnu.com/">Sandbox</a>
        </p>
      </div>
    </footer>
  );
}
