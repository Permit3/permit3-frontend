import { useRouter } from "next/router";
import { HomeIcon } from "../icons/HomeIcon";
import { PermitIcon } from "../icons/PermitIcon";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { useDispatch } from "react-redux";
import { setPreviousEndpoint } from "@/store/navigationSlice";
import { setLoginType } from "@/store/userSlice";
import { LogoutIconSidebar } from "../icons/LogoutIconSidebar";
import Link from "next/link";

interface SidebarProps {
  activeIdx: number;
}

function Sidebar(props: SidebarProps) {
  const { activeIdx } = props;
  const { isConnected } = useAccount();
  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();

  return (
    <div className="hidden md:flex h-full border-r border-white/25 md:flex-col gap-4 p-8 select-none">
      <Link
        href="/"
        className={activeIdx === 0 ? "pointer-events-none" : ""}
        aria-disabled={activeIdx === 0}
        tabIndex={activeIdx === 0 ? -1 : undefined}
      >
        <div
          className={`flex flex-row gap-2 ${
            activeIdx === 0 ? "cursor-default" : "opacity-50 hover:opacity-100 cursor-pointer"
          }`}
        >
          <HomeIcon />
          <div>Dashboard</div>
        </div>
      </Link>
      <Link
        href="/permit"
        className={activeIdx === 1 ? "pointer-events-none" : ""}
        aria-disabled={activeIdx === 1}
        tabIndex={activeIdx === 1 ? -1 : undefined}
      >
        <div
          className={`flex flex-row gap-2 ${
            activeIdx === 1 ? "cursor-default" : "opacity-50 hover:opacity-100 cursor-pointer"
          }`}
        >
          <PermitIcon />
          <div>Permit</div>
        </div>
      </Link>

      <div
        className="flex flex-row gap-2 opacity-50 hover:opacity-100 cursor-pointer mt-auto"
        onClick={() => {
          if (isConnected) {
            disconnect();
            dispatch(setPreviousEndpoint(undefined));
            dispatch(setLoginType(""));
          }
        }}
      >
        {isConnected ? (
          <>
            <LogoutIconSidebar />
            <div>Logout</div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Sidebar;
