import Image from "next/image";

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
      <div className="flex flex-row items-center justify-between pb-16 pt-36">
        <div className="flex flex-grow flex-row justify-center space-x-4">
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
        <a href="/">
          <Image
            className="ml-auto mr-12"
            src="/icons/Dark Mode Logo.svg"
            width={120}
            height={120}
            alt="good-dog-logo"
          />
        </a>
      </div>
    </footer>
  );
}

/**
 * issues rendering pictures
 * issues rendering colors
 * unsure where to put pictures in file tree
 */
