import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/root";
import DropdownUser from "./dropdown/DropdownUser";
import Button from "./ui/forms/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount, useDisconnect, useNetwork } from "@starknet-react/core";
import { Permit3LogoIcon } from "./icons/Permit3LogoIcon";
import { useDimensions } from "./ui/hooks/useDimensions";
import { useSpring, config, animated } from "react-spring";
import { HamburgerIcon } from "./icons/HamburgerIcon";
import { setPreviousEndpoint } from "@/store/navigationSlice";
import { setLoginType, setOpenLoginModal } from "@/store/userSlice";

interface NavbarProps {
  logoOnly?: boolean;
  showSocial?: boolean;
  showCreate?: boolean;
  applyMaxWidth?: boolean;
  fixed?: boolean;
  transparent?: boolean;
}

function Navbar(props: NavbarProps) {
  const {
    logoOnly = false,
    showSocial = true,
    showCreate = true,
    applyMaxWidth = true,
    fixed = true,
    transparent = false
  } = props;

  const [subMenuActive, handleSubMenuActive] = useState(-1);
  const [showMobileNavbar, handleShowMobileNavbar] = useState(false);
  const [chainId, handleChainId] = useState<bigint>(BigInt(-1));
  const router = useRouter();

  const { ethAlias, ethAvatar } = useSelector((state: RootState) => state.user);
  const { address, isConnected, isReconnecting, account } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const dispatch = useDispatch();

  const [dimensionsRef, height] = useDimensions();
  const slideInStyles = useSpring({
    config: { ...config.default },
    from: { height: 0 },
    to: {
      height: showMobileNavbar ? height : 0
    }
  });

  useEffect(() => {
    if (isConnected) {
      (async () => {
        handleChainId(chain.id);
      })();
    } else {
      handleChainId(BigInt(-1));
    }
  }, [chainId]);

  useEffect(() => {
    let eventListener: any = null;
    if (subMenuActive !== -1) {
      // @ts-ignore
      eventListener = hideMenu.bind(this);
      document.addEventListener("click", eventListener);
    }

    return () => {
      if (eventListener) {
        document.removeEventListener("click", eventListener);
      }
    };
  }, [subMenuActive]);

  const hideMenu = (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      const navbarComponents = document.getElementsByClassName("navbar-component");
      for (let i = 0; i < navbarComponents.length; i++) {
        if (navbarComponents[i].contains(event.target)) {
          return;
        }
      }
    }
    handleSubMenuActive(-1);
  };

  const mobilelinks = (
    <>
      <div className="z-40 flex-1 flex flex-col w-full">
        <div className="w-full md:ml-0 flex flex-col ">
          <div className="w-full block ">
            <div className={`bg-black w-full`}>
              <animated.div style={{ ...slideInStyles, overflow: "hidden" }}>
                <div
                  ref={dimensionsRef}
                  id="dropdown"
                  role="navigation"
                  className="flex flex-col w-full bg-black h-auto content-menu"
                >
                  <div className="ml-auto" />
                  <Link href="/">
                    <div
                      className={`navbar-component text-white my-auto cursor-pointer`}
                      onClick={(e: any) => {
                        handleShowMobileNavbar(false);
                      }}
                    >
                      <div className="flex my-auto p-4 hover:bg-white/10">
                        <div className="my-auto">Dashboard</div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/permit">
                    <div
                      className={`navbar-component text-white my-auto cursor-pointer`}
                      onClick={(e: any) => {
                        handleShowMobileNavbar(false);
                      }}
                    >
                      <div className="flex my-auto p-4 hover:bg-white/10">
                        <div className="my-auto">Permit</div>
                      </div>
                    </div>
                  </Link>

                  <div
                    className={`navbar-component text-white my-auto cursor-pointer`}
                    onClick={(e: any) => {
                      handleShowMobileNavbar(false);
                      if (!isConnected) {
                        // Show login modal
                        dispatch(setOpenLoginModal(true));
                      } else {
                        // Log user out
                        disconnect();
                        dispatch(setPreviousEndpoint(undefined));
                        dispatch(setLoginType(""));
                      }
                    }}
                  >
                    <div className="flex my-auto p-4 hover:bg-white/10">
                      <div className="my-auto">{!isConnected ? "Connect Wallet" : "Log Out"}</div>
                    </div>
                  </div>
                </div>
              </animated.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`w-full absolute ${transparent ? "bg-transparent" : "bg-background"} z-11 border-b border-white/20`}
    >
      <nav className={`select-none${!logoOnly ? " w-full" : ""}`}>
        <div
          id="nav"
          className={`${
            showMobileNavbar ? "bg-black md:bg-transparent" : "bg-transparent duration-500"
          } flex flex-col md:flex-row ${fixed ? "fixed " : ""}z-11${!logoOnly ? " w-full" : ""}`}
        >
          <div className={`w-full flex flex-col md:flex-row mx-auto${applyMaxWidth ? " max-w-7xl" : ""}`}>
            <div id="nav-top" className="bg-transparent w-full px-4 md:px-8">
              <div className="flex flex-row h-16">
                <div className="flex mr-4 my-auto z-11">
                  <Link href="/">
                    <Permit3LogoIcon className="" />
                  </Link>
                </div>
                <div className="flex ml-auto md:hidden">
                  <div
                    className={`md:hidden my-auto bg-transparent mr-2 flex flex-row cursor-pointer`}
                    onClick={() => {
                      handleShowMobileNavbar(!showMobileNavbar);
                    }}
                  >
                    <HamburgerIcon />
                  </div>
                </div>
                {!logoOnly ? (
                  <div className="hidden ml-auto md:flex py-auto gap-4 z-11">
                    <DropdownUser />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Mobile links */}
          <div className="block md:hidden">{mobilelinks}</div>
          <div
            className={`top-0 left-0 -z-11 w-screen h-screen bg-slate-900 bg-opacity-30 ${
              showMobileNavbar ? "fixed md:hidden" : "hidden"
            }`}
            onClick={() => handleShowMobileNavbar(false)}
          />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
