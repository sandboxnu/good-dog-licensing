import Image from "next/image";

import emailIcon from "./email_icon.svg";
import facebookIcon from "./facebook_icon.svg";
import footerChecker from "./footer_checker.svg";
import instagramIcon from "./instagram_icon.svg";
import twitterIcon from "./twitter_icon.svg";
import youtubeIcon from "./youtube_icon.svg";

export default function Footer() {
  return (
    <footer>
      <Image className="w-full" src={footerChecker} alt="footer-checker" />
      <div className="flex flex-row justify-center bg-good-dog-celadon pb-16 pt-36 space-x-4">
        <Image
          src={facebookIcon}
          width={70}
          height={70}
          alt="good-dog-facebook"
        />
        <Image
          src={twitterIcon}
          width={70}
          height={70}
          alt="good-dog-twitter"
        />
        <Image
          src={instagramIcon}
          width={70}
          height={70}
          alt="good-dog-instagram"
        />
        <Image src={emailIcon} width={70} height={70} alt="good-dog-email" />
        <Image
          src={youtubeIcon}
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
