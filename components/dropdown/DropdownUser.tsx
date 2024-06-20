import Identicon from "../common/IdentIcon";
import Dropdown from "../ui/dropdown/Dropdown";
import UserDisplay from "../UserDisplay";
import { useDispatch } from "react-redux";
import { setLoginType, setOpenLoginModal } from "../../store/userSlice";
import Button from "../ui/forms/Button";
import { WalletIcon } from "../icons/WalletIcon";
import { useRouter } from "next/router";
import { LogoutIcon } from "../icons/LogoutIcon";
import { setPreviousEndpoint } from "../../store/navigationSlice";
import { useAccount, useDisconnect } from "@starknet-react/core";

interface DropdownUserProps {}

function DropdownUser(props: DropdownUserProps) {
  const { disconnect } = useDisconnect();
  const { address, isConnected, isReconnecting, account } = useAccount();
  const dispatch = useDispatch();
  const router = useRouter();

  if (!isConnected) {
    return (
      <>
        <Button style="secondary" className="my-auto" onClick={() => dispatch(setOpenLoginModal(true))}>
          Connect Wallet
        </Button>
        <Button
          style="secondary"
          className="block md:hidden w-full font-bold py-3 px-6 whitespace-nowrap border-2"
          rounded={true}
          customFont={true}
          customSizing={true}
          icon={<WalletIcon />}
          onClick={() => dispatch(setOpenLoginModal(true))}
        ></Button>
      </>
    );
  }

  return (
    <Dropdown
      align="right"
      handleOpenChanged={() => {
        // Implement this as needed
      }}
      button={
        <>
          <div id="account-button">
            <div className="bg-dark-2 rounded-sm flex py-1 px-4">
              {address ? `${address.slice(0, 8)}...${address.slice(address.length - 5)}` : "--"}
              <span className="ml-2 mt-px">
                <svg width="10" height="100%" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 9L0.0717975 3.51391e-07L13.9282 -8.59975e-07L7 9Z" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>
        </>
      }
      dropdownChildren={() => (
        <>
          <div className="px-4 flex items-center justify-start w-max">
            <div className="identicon cursor-pointer border border-white/20 mr-2 r-4 flex rounded-full">
              <div className="p-2">
                <Identicon
                  string={address ? address : ""}
                  size={17}
                  palette={["#FFC32A", "#AEDFFB", "#6C66E9", "#FFDB80", "#CDCDCD", "#000000", "#C9AEFB", "#B9E5D4"]}
                />
              </div>
            </div>
            <UserDisplay />
          </div>

          <div
            className={`justify-start px-6 flex cursor-pointer mx-auto py-4 rounded-b-md hover:bg-card`}
            role="menuitem"
            tabIndex={-1}
            onClick={async (e: any) => {
              e.preventDefault();
              e.stopPropagation();
              disconnect();
              dispatch(setPreviousEndpoint(undefined));
              dispatch(setLoginType(""));
            }}
          >
            <div className="flex-col justify-start mr-2 my-auto">
              <LogoutIcon className="fill-current w-[24px] h-auto" />
            </div>
            <div className="">Log Out</div>
          </div>
        </>
      )}
    />
  );
}

export default DropdownUser;
