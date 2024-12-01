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
      <div className="flex flex-row items-end justify-between px-12 py-16">
        <div className="ml-24 flex flex-grow justify-center space-x-4">
          <a href="https://twitter.com/gdlicensing">
            <Image
              src="/icons/twitter_icon.svg"
              width={70}
              height={70}
              alt="good-dog-twitter"
            />
          </a>
          <a href="https://www.instagram.com/gooddoglicensing/">
            <Image
              src="/icons/instagram_icon.svg"
              width={70}
              height={70}
              alt="good-dog-instagram"
            />
          </a>
          <a href="mailto:gooddoglicensing@gmail.com">
            <Image
              src="/icons/email_icon.svg"
              width={70}
              height={70}
              alt="good-dog-email"
            />
          </a>
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
    </footer>
  );
}
