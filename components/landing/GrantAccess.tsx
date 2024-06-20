import { useState } from "react";
import { NotFoundIcon } from "../icons/NotFoundIcon";
import Button from "../ui/forms/Button";
import Input from "../ui/forms/Input";
import { GreenCheckIcon } from "../icons/GreenCheckIcon";
import { LinkExternalIcon } from "../icons/LinkExternalIcon";
import Link from "next/link";
import { MODAL_TYPE, useGlobalModalContext } from "../ui/modals/ModalContext";
import { NoIcon } from "../icons/NoIcon";
import { SuccessIcon } from "../icons/SuccessIcon";
import { hash } from "starknet";
import Radio from "../ui/forms/Radio";

function GrantAccess() {
  const [success, handleSuccess] = useState(true);
  const [failed, handleFailed] = useState(false);
  const [contractAddress, handleContractAddress] = useState("");
  const [funcName, handleFuncName] = useState("");
  const [numApprovals, handleNumApprovals] = useState(0);
  const [checked, handleChecked] = useState(0);

  const { showModal, hideModal } = useGlobalModalContext();

  return (
    <div className="h-full w-full flex flex-col p-8">
      <div className="font-outfit font-black text-4xl mx-auto">Grant contact access to an address</div>
      <div className="font-medium mx-auto">Permit an address to access a smart contract on your behalf</div>
      <div className="flex flex-row gap-4 my-8">
        <div className="flex flex-row w-full gap-4">
          <Input className="flex-1 h-[2.25rem]" label="Grant" placeholder="Input permit address (0x...)" />
          <Input
            className="flex-1 h-[2.25rem]"
            label="To Access"
            placeholder="Input smart contract address (0x...)"
            value={contractAddress}
            onChange={(e) => handleContractAddress(e.target.value)}
          />
        </div>
        <Button
          className="mt-auto mb-[2px]"
          onClick={() => {
            // First modal
            // showModal(
            //   MODAL_TYPE.TRANSACTION_FLOW,
            //   {
            //     loading: false,
            //     subtitle: `Are you sure you want to revoke access to [project name] from [address]?`,
            //     okButtonText: "Revoke Access",
            //     okButtonCallback: () => {},
            //     closeButtonText: "Cancel",
            //     closeButtonCallback: () => {
            //       hideModal();
            //     },
            //     customIcon: (
            //       <div className="select-none rounded-full overflow-hidden mb-4">
            //         <NoIcon className="h-[5.75rem] w-[5.75rem]" />
            //       </div>
            //     )
            //   },
            //   { showHeader: true, title: "Revoke Access" }
            // );
            // Second modal
            // showModal(
            //   MODAL_TYPE.TRANSACTION_FLOW,
            //   {
            //     loading: false,
            //     subtitle: `Access revoked successfully from [project name] for [address].`,
            //     closeButtonText: "OK",
            //     closeButtonCallback: () => {
            //       hideModal();
            //     },
            //     customIcon: (
            //       <div className="select-none rounded-full overflow-hidden mb-4">
            //         <SuccessIcon className="h-[5.75rem] w-[5.75rem]" />
            //       </div>
            //     )
            //   },
            //   { showHeader: true, title: "Access Revoked" }
            // );
          }}
        >
          Continue
        </Button>
      </div>
      {success ? (
        <div className="w-full flex flex-col bg-dark-2 rounded-lg p-12">
          <GreenCheckIcon className="mx-auto" />
          <div className="text-sm font-medium w-full mt-1">
            <div className="flex gap-1 items-center justify-center text-white/70">
              {contractAddress}
              <Link href={`https://starkscan.co/contract/${contractAddress}`}>
                <span className="cursor-pointer">
                  <LinkExternalIcon />
                </span>
              </Link>
            </div>
          </div>
          <div className="font-outfit font-semibold text-2xl mt-8">Grant Access</div>
          <div className="flex flex-row w-full gap-4 my-6">
            <div
              className={`rounded-lg w-full p-0.5 select-none ${
                checked === 0
                  ? "bg-gradient-to-r from-gradient-default-start via-gradient-default-mid to-gradient-default-stop"
                  : "bg-white/20"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleChecked(0);
              }}
            >
              <div className="rounded-md bg-dark-2 py-2 px-4">
                <Radio
                  groupName="access"
                  label="Grant full access"
                  size="lg"
                  checked={checked === 0}
                  onClick={(e: any) => handleChecked(e.target.checked ? 0 : -1)}
                />
                <div className="font-light text-sm ml-6">Grant full access to the specified address</div>
              </div>
            </div>
            <div
              className={`rounded-lg w-full p-0.5 select-none ${
                checked === 1
                  ? "bg-gradient-to-r from-gradient-default-start via-gradient-default-mid to-gradient-default-stop"
                  : "bg-white/20"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleChecked(1);
              }}
            >
              <div className="rounded-md bg-dark-2 py-2 px-4">
                <Radio
                  groupName="access"
                  label="Grant select access"
                  size="lg"
                  checked={checked === 1}
                  onClick={(e: any) => handleChecked(e.target.checked ? 1 : -1)}
                />
                <div className="font-light text-sm ml-6">Grant select access to the specified address</div>
              </div>
            </div>
          </div>
          {checked === 1 ? (
            <div className="flex flex-row w-full gap-4 my-6">
              <Input
                className="flex-1 h-[2.25rem]"
                label="Function Name"
                placeholder="Enter function name"
                value={funcName}
                onChange={(e) => handleFuncName(e.target.value)}
              />
              <Input
                className="flex-1 h-[2.25rem]"
                label="Number of Approvals"
                placeholder="Enter number of delegate approvals"
                type="number"
                value={numApprovals.toString()}
                onChange={(e) => handleNumApprovals(parseInt(e.target.value))}
              />
            </div>
          ) : null}
          <Button
            className="ml-auto"
            onClick={() => {
              const selector = hash.starknetKeccak(funcName).toString(16);
              console.log(selector);
              console.log(numApprovals);
            }}
          >
            Grant Access
          </Button>
        </div>
      ) : failed ? (
        <>
          <div className="w-full flex flex-col bg-dark-2 rounded-lg p-12">
            <NotFoundIcon className="mx-auto" />
            <div className="mt-4 font-outfit text-2xl mx-auto font-semibold">No Project Found</div>
            <div className="text-sm font-medium mx-auto mt-1">
              No project found with the provided address. Please enter a valid contract address.
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col bg-dark-2 rounded-lg p-12">
          <NotFoundIcon className="mx-auto" />
          <div className="mt-4 font-outfit text-2xl mx-auto font-semibold">Please enter a contract address</div>
          <div className="text-sm font-medium mx-auto mt-1">Please enter a contract address</div>
        </div>
      )}
    </div>
  );
}

export default GrantAccess;
