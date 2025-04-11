import Link from "next/link";

import { Button } from "@good-dog/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@good-dog/ui/dropdown-menu";

interface NavProfileDropdownProps {
  userFirstName: string;
  signOut: () => void;
}

export default function NavProfileDropdown({
  userFirstName,
  signOut,
}: NavProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-3">
          <svg
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="Vector"
              d="M16.4821 17.0504C14.9047 17.0504 13.3628 16.5504 12.0513 15.6137C10.7398 14.6769 9.71759 13.3455 9.11397 11.7877C8.51034 10.2299 8.3524 8.51577 8.66013 6.86203C8.96785 5.2083 9.72742 3.68926 10.8428 2.49698C11.9581 1.30471 13.3792 0.492761 14.9262 0.163814C16.4732 -0.165134 18.0768 0.00369386 19.5341 0.648948C20.9914 1.2942 22.2369 2.3869 23.1132 3.78886C23.9896 5.19083 24.4573 6.83909 24.4573 8.52522C24.4573 10.7863 23.6171 12.9547 22.1214 14.5535C20.6258 16.1523 18.5972 17.0504 16.4821 17.0504ZM16.4821 3.41009C15.5357 3.41009 14.6105 3.71009 13.8236 4.27215C13.0367 4.8342 12.4234 5.63308 12.0612 6.56775C11.699 7.50242 11.6043 8.5309 11.7889 9.52314C11.9735 10.5154 12.4293 11.4268 13.0985 12.1422C13.7677 12.8575 14.6203 13.3447 15.5486 13.5421C16.4768 13.7394 17.4389 13.6381 18.3133 13.251C19.1876 12.8638 19.935 12.2082 20.4608 11.367C20.9866 10.5259 21.2672 9.5369 21.2672 8.52522C21.2672 7.16861 20.7631 5.86755 19.8657 4.90828C18.9683 3.94901 17.7512 3.41009 16.4821 3.41009ZM31.3691 32.9642C30.9478 32.9583 30.5453 32.7768 30.2474 32.4583C29.9494 32.1398 29.7796 31.7095 29.7741 31.2591C29.7741 26.826 27.5198 23.8706 16.4821 23.8706C5.44441 23.8706 3.19008 26.826 3.19008 31.2591C3.19008 31.7113 3.02203 32.145 2.72291 32.4648C2.42378 32.7845 2.01807 32.9642 1.59504 32.9642C1.17201 32.9642 0.766305 32.7845 0.467177 32.4648C0.168048 32.145 0 31.7113 0 31.2591C0 20.4605 11.5481 20.4605 16.4821 20.4605C21.4161 20.4605 32.9642 20.4605 32.9642 31.2591C32.9587 31.7095 32.7889 32.1398 32.4909 32.4583C32.193 32.7768 31.7905 32.9583 31.3691 32.9642Z"
              fill="#03BC92"
            />
          </svg>
          <div className="flex items-center space-x-1">
            <p className="text-xl text-white">{userFirstName}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M16.5 8.25L11 13.75L5.5 8.25"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="mt-[35px] w-[170px] bg-good-dog-black"
        align="end"
        forceMount
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              className="!font-afacad !text-lg font-normal text-white"
              href="/profile"
            >
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              className="!font-afacad !text-lg font-normal text-white"
              href="/settings"
            >
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="!font-afacad flex w-full justify-start bg-good-dog-black !text-lg font-normal text-white"
              onClick={signOut}
            >
              Sign out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
