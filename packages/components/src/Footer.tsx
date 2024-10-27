import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <Image
        className="relative"
        src="/bg-assets/footer_checker.svg"
        alt="footer-checker"
        width={0}
        height={0}
        style={{ width: "100%", height: "auto" }}
      />
      <div className="flex flex-row justify-center space-x-4 bg-good-dog-celadon pb-16 pt-36">
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
    </footer>
  );
}

/**
 * issues rendering pictures
 * issues rendering colors
 * unsure where to put pictures in file tree
 */
