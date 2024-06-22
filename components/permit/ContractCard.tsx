import { useState } from "react";
import { NoIcon } from "../icons/NoIcon";
import { PersonIcon } from "../icons/PersonIcon";
import Button from "../ui/forms/Button";
import { MODAL_TYPE, useGlobalModalContext } from "../ui/modals/ModalContext";
import usePermit3 from "@/utils/hooks/usePermit3";
import { useAccount } from "@starknet-react/core";
import useWaitForTx from "@/utils/hooks/useWaitForTx";
import { useNotification } from "@/utils/notification/NotificationProvider";
import { SuccessIcon } from "../icons/SuccessIcon";
import { CallData } from "starknet";

interface ContractCardProps {
  contract: {
    address: string;
    full: Permit[];
    partial: Permit[];
  };
  updateContract: (contract: { address: string; full: Permit[]; partial: Permit[] }) => void;
}

function ContractCard(props: ContractCardProps) {
  const { contract: contractData, updateContract } = props;
  const [actionLoading, handleActionLoading] = useState(false);

  const { showModal, hideModal, setTopModalProps } = useGlobalModalContext();
  const { contract } = usePermit3();
  const { account } = useAccount();
  const { wait } = useWaitForTx();
  const { NotificationAdd } = useNotification();

  const revokeAllAccess = async () => {
    if (!contract.contract || !account) {
      return;
    }
    handleActionLoading(true);
    hideModal();
    showModal(MODAL_TYPE.TRANSACTION_FLOW, { loading: true }, { showHeader: false, preventModalClose: true });
    try {
      contract.contract.connect(account);
      // Build multicall
      const callArr = [];
      if (contractData.full.length > 0) {
        callArr.push({
          contractAddress: contract.contract.address,
          entrypoint: "permit_all_rights_in_contract",
          calldata: CallData.compile([account.address, contractData.address, 0])
        });
      }
      if (contractData.partial.length > 0) {
        for (const p of contractData.partial) {
          callArr.push({
            contractAddress: contract.contract.address,
            entrypoint: "permit",
            calldata: CallData.compile([account.address, contractData.address, p.rights, 0])
          });
        }
      }

      // Remove permits using multicall
      const txHash = await account.execute(callArr);
      await wait(txHash.transaction_hash);

      // Update UI
      updateContract({ address: contractData.address, full: [], partial: [] });

      // Hide loading modal
      hideModal();

      // Show success modal
      showModal(
        MODAL_TYPE.TRANSACTION_FLOW,
        {
          loading: false,
          subtitle: `Permits revoked successfully for ${contractData.address.slice(
            0,
            6
          )}...${contractData.address.slice(contractData.address.length - 4)}.`,
          closeButtonText: "OK",
          closeButtonCallback: () => {
            hideModal();
          },
          customIcon: (
            <div className="select-none rounded-full overflow-hidden mb-4">
              <SuccessIcon className="h-[5.75rem] w-[5.75rem]" />
            </div>
          )
        },
        { showHeader: true, title: "Permits Revoked" }
      );

      handleActionLoading(false);
    } catch (err) {
      console.log(err);
      handleActionLoading(false);
      hideModal();
      NotificationAdd("ERROR", "Error", `${err}`);
    }
  };

  const revokeAccess = async (full: boolean = false, selector?: string) => {
    if (!contract.contract || !account) {
      return;
    }
    handleActionLoading(true);
    hideModal();
    showModal(MODAL_TYPE.TRANSACTION_FLOW, { loading: true }, { showHeader: false, preventModalClose: true });
    try {
      contract.contract.connect(account);
      // Remove permit
      if (full) {
        let txHash = await contract.contract.permit_all_rights_in_contract(account.address, contractData.address, 0);
        if (!txHash) {
          return;
        }
        await wait(txHash.transaction_hash);
      } else {
        let txHash = await contract.contract.permit(account.address, contractData.address, selector, 0);
        if (!txHash) {
          return;
        }
        await wait(txHash.transaction_hash);
      }

      // Update UI
      if (full) {
        updateContract({ address: contractData.address, full: [], partial: contractData.partial });
      } else {
        const partial = contractData.partial;
        const idx = partial.findIndex((p) => p.rights === selector);
        if (idx >= 0) {
          partial.splice(idx, 1);
        }
        updateContract({ address: contractData.address, full: contractData.full, partial });
      }

      // Hide loading modal
      hideModal();

      // Show success modal
      showModal(
        MODAL_TYPE.TRANSACTION_FLOW,
        {
          loading: false,
          subtitle: `Permit revoked successfully for ${contractData.address.slice(0, 6)}...${contractData.address.slice(
            contractData.address.length - 4
          )}.`,
          closeButtonText: "OK",
          closeButtonCallback: () => {
            hideModal();
          },
          customIcon: (
            <div className="select-none rounded-full overflow-hidden mb-4">
              <SuccessIcon className="h-[5.75rem] w-[5.75rem]" />
            </div>
          )
        },
        { showHeader: true, title: "Permit Revoked" }
      );

      handleActionLoading(false);
    } catch (err) {
      console.log(err);
      handleActionLoading(false);
      hideModal();
      NotificationAdd("ERROR", "Error", `${err}`);
    }
  };

  return (
    <div className="rounded-lg bg-dark-2 border border-[#1F2328] p-4 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <PersonIcon />
          <div className="font-outfit font-semibold text-2xl">
            {contractData.address
              ? `${contractData.address.slice(0, 6)}...${contractData.address.slice(contractData.address.length - 4)}`
              : "--"}
          </div>
        </div>
        <div className="flex-nowrap">
          <Button
            style="tertiary-colored"
            shadow={false}
            onClick={() => {
              showModal(
                MODAL_TYPE.TRANSACTION_FLOW,
                {
                  loading: actionLoading,
                  subtitle: `Are you sure you want to revoke all permits from ${contractData.address.slice(
                    0,
                    6
                  )}...${contractData.address.slice(contractData.address.length - 4)}?`,
                  okButtonText: "Revoke Permits",
                  okButtonCallback: async () => {
                    await revokeAllAccess();
                  },
                  closeButtonText: "Cancel",
                  closeButtonCallback: () => {
                    hideModal();
                  },
                  customIcon: (
                    <div className="select-none rounded-full overflow-hidden mb-4">
                      <NoIcon className="h-[5.75rem] w-[5.75rem]" />
                    </div>
                  )
                },
                { showHeader: true, title: "Revoke Permit" }
              );
            }}
          >
            Revoke All Permits
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#282828]">
            <tr>
              <th scope="row" className="py-2 px-4">
                Selector
              </th>
              <th scope="row" className="py-2 px-4">
                Remaining Permit Allowance
              </th>
              <th scope="row" className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {contractData.full.map((p, idx) => (
              <tr key={`${contractData.address}-full-${idx}`}>
                <td className="py-2 px-4">*</td>
                <td className="py-2 px-4">Unlimited</td>
                <td className="text-right">
                  <Button
                    style="tertiary-colored"
                    shadow={false}
                    onClick={() => {
                      showModal(
                        MODAL_TYPE.TRANSACTION_FLOW,
                        {
                          loading: actionLoading,
                          subtitle: `Are you sure you want to revoke full access from ${contractData.address.slice(
                            0,
                            6
                          )}...${contractData.address.slice(
                            contractData.address.length - 4
                          )}? Partial selector permits will remain unmodified.`,
                          okButtonText: "Revoke Permit",
                          okButtonCallback: async () => {
                            await revokeAccess(true);
                          },
                          closeButtonText: "Cancel",
                          closeButtonCallback: () => {
                            hideModal();
                          },
                          customIcon: (
                            <div className="select-none rounded-full overflow-hidden mb-4">
                              <NoIcon className="h-[5.75rem] w-[5.75rem]" />
                            </div>
                          )
                        },
                        { showHeader: true, title: "Revoke Permit" }
                      );
                    }}
                  >
                    Revoke
                  </Button>
                </td>
              </tr>
            ))}
            {contractData.partial.map((p, idx) => (
              <tr key={`${contractData.address}-partial-${idx}`}>
                <td className="py-2 px-4">{`${p.rights.slice(0, 6)}...${p.rights.slice(p.rights.length - 4)}`}</td>
                <td className="py-2 px-4">{p.number.toString()}</td>
                <td className="text-right">
                  <Button
                    style="tertiary-colored"
                    shadow={false}
                    onClick={() => {
                      showModal(
                        MODAL_TYPE.TRANSACTION_FLOW,
                        {
                          loading: actionLoading,
                          subtitle: `Are you sure you want to revoke the ${p.rights.slice(0, 6)}...${p.rights.slice(
                            p.rights.length - 4
                          )} permit from ${contractData.address.slice(0, 6)}...${contractData.address.slice(
                            contractData.address.length - 4
                          )}?`,
                          okButtonText: "Revoke Permit",
                          okButtonCallback: async () => {
                            await revokeAccess(false, p.rights);
                          },
                          closeButtonText: "Cancel",
                          closeButtonCallback: () => {
                            hideModal();
                          },
                          customIcon: (
                            <div className="select-none rounded-full overflow-hidden mb-4">
                              <NoIcon className="h-[5.75rem] w-[5.75rem]" />
                            </div>
                          )
                        },
                        { showHeader: true, title: "Revoke Permit" }
                      );
                    }}
                  >
                    Revoke
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContractCard;
