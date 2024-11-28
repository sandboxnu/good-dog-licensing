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
          <Image
            src="/icons/facebook_icon.svg"
            width={70}
            height={70}
            alt="good-dog-facebook"
          />
          <Image
            src="/icons/twitter_icon.svg"
            width={70}
            height={70}
            alt="good-dog-twitter"
          />
          <Image
            src="/icons/instagram_icon.svg"
            width={70}
            height={70}
            alt="good-dog-instagram"
          />
          <Image
            src="/icons/email_icon.svg"
            width={70}
            height={70}
            alt="good-dog-email"
          />
          <Image
            src="/icons/youtube_icon.svg"
            width={70}
            height={70}
            alt="good-dog-youtube"
          />
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
