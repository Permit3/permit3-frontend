import { useState } from "react";
import { NotFoundIcon } from "../icons/NotFoundIcon";
import Button from "../ui/forms/Button";
import Input from "../ui/forms/Input";
import { GreenCheckIcon } from "../icons/GreenCheckIcon";
import { LinkExternalIcon } from "../icons/LinkExternalIcon";
import Link from "next/link";
import { hash } from "starknet";
import Radio from "../ui/forms/Radio";
import usePermit3 from "@/utils/hooks/usePermit3";
import { useNotification } from "@/utils/notification/NotificationProvider";
import useWaitForTx from "@/utils/hooks/useWaitForTx";
import { useAccount } from "@starknet-react/core";

function GrantAccess() {
  const [failed, handleFailed] = useState(false);
  const [entered, handleEntered] = useState(false);
  const [actionLoading, handleActionLoading] = useState(false);
  const [operatorAddress, handleOperatorAddress] = useState("");
  const [contractAddress, handleContractAddress] = useState("");
  const [funcName, handleFuncName] = useState("");
  const [numApprovals, handleNumApprovals] = useState(0);
  const [checked, handleChecked] = useState(0);

  const { NotificationAdd } = useNotification();
  const { contract } = usePermit3();
  const { wait } = useWaitForTx();
  const { account } = useAccount();

  return (
    <div className="h-full w-full flex flex-col p-8">
      <div className="font-outfit font-black leading-tight text-4xl mx-auto">Grant contact access to an address</div>
      <div className="font-medium mx-auto">Permit an address to access a smart contract on your behalf</div>
      <div className="flex flex-col md:flex-row gap-4 my-8">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <Input
            className="flex-1 h-[2.25rem]"
            label="Grant"
            placeholder="Input permit address (0x...)"
            value={operatorAddress}
            onChange={(e) => handleOperatorAddress(e.target.value)}
          />
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
            if (operatorAddress.trim().length > 0 && contractAddress.trim().length > 0) {
              handleEntered(true);
            } else {
              NotificationAdd("ERROR", "Invalid Input", "Please enter a valid grant address and contract address.");
            }
          }}
        >
          Continue
        </Button>
      </div>
      {entered ? (
        <div className="w-full flex flex-col bg-dark-2 border border-[#1F2328] rounded-lg p-6 md:p-12">
          <GreenCheckIcon className="mx-auto" />
          <div className="text-sm font-medium w-full mt-2">
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
          <div className="flex flex-col md:flex-row w-full gap-4 my-6">
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
              <div className="rounded-md bg-dark-2 py-2 px-4 h-full">
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
            <div className="flex flex-col md:flex-row w-full gap-4 mt-2 md:mt-6 mb-6">
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
            loading={actionLoading}
            onClick={async () => {
              if (!contract?.contract || !account) {
                return;
              }
              if (checked === 0) {
                // Permit all for contract
                handleActionLoading(true);
                try {
                  const maxNum = await contract.contract.get_unlimited_number_of_permits_constant();
                  contract.contract.connect(account);
                  let txHash = await contract.contract.permit_all_rights_in_contract(
                    operatorAddress,
                    contractAddress,
                    maxNum
                  );
                  if (!txHash) {
                    return;
                  }
                  await wait(txHash.transaction_hash);
                  NotificationAdd("SUCCESS", "Permit Granted", "Your permit was successfully granted.");

                  // Clean up UI
                  handleEntered(false);
                  handleOperatorAddress("");
                  handleContractAddress("");
                } catch (err) {
                  console.log(err);
                  NotificationAdd("ERROR", "Error", `${err}`);
                }
                handleActionLoading(false);
              } else {
                // Permit a specific function for contract
                const selector = `0x${hash.starknetKeccak(funcName).toString(16)}`;
                handleActionLoading(true);
                try {
                  contract.contract.connect(account);
                  let txHash = await contract.contract.permit(operatorAddress, contractAddress, selector, numApprovals);
                  if (!txHash) {
                    return;
                  }
                  await wait(txHash.transaction_hash);
                  NotificationAdd("SUCCESS", "Permit Granted", "Your permit was successfully granted.");

                  // Clean up UI
                  handleEntered(false);
                  handleOperatorAddress("");
                  handleContractAddress("");
                  handleFuncName("");
                  handleNumApprovals(0);
                  handleChecked(0);
                } catch (err) {
                  console.log(err);
                  NotificationAdd("ERROR", "Error", `${err}`);
                }
                handleActionLoading(false);
              }
            }}
          >
            Grant Access
          </Button>
        </div>
      ) : failed ? (
        <>
          <div className="w-full flex flex-col bg-dark-2 border border-[#1F2328] rounded-lg p-12">
            <NotFoundIcon className="mx-auto" />
            <div className="mt-4 font-outfit text-2xl mx-auto font-semibold">No Project Found</div>
            <div className="text-sm font-medium mx-auto mt-1">
              No project found with the provided address. Please enter a valid contract address.
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col bg-dark-2 border border-[#1F2328] rounded-lg p-12">
          <NotFoundIcon className="mx-auto" />
          <div className="mt-4 font-outfit text-2xl mx-auto font-semibold">Please enter a contract address</div>
          <div className="text-sm font-medium mx-auto mt-1">Please enter a contract address</div>
        </div>
      )}
    </div>
  );
}

export default GrantAccess;
