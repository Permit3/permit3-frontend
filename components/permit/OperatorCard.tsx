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

interface OperatorCardProps {
  operator: {
    address: string;
    full: Permit[];
    partial: Permit[];
  };
  updatePermits: (operator: string, permits: Permit[]) => void;
}

function OperatorCard(props: OperatorCardProps) {
  const { operator, updatePermits } = props;
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
      if (operator.full.length > 0) {
        for (const p of operator.partial) {
          callArr.push({
            contractAddress: contract.contract.address,
            entrypoint: "permit_all_rights_in_contract",
            calldata: CallData.compile([operator.address, p.contract, 0])
          });
        }
      }
      if (operator.partial.length > 0) {
        for (const p of operator.partial) {
          callArr.push({
            contractAddress: contract.contract.address,
            entrypoint: "permit",
            calldata: CallData.compile([operator.address, p.contract, p.rights, 0])
          });
        }
      }

      // Remove permits using multicall
      const txHash = await account.execute(callArr);
      await wait(txHash.transaction_hash);

      // Update UI
      updatePermits(operator.address, []);

      // Hide loading modal
      hideModal();

      // Show success modal
      showModal(
        MODAL_TYPE.TRANSACTION_FLOW,
        {
          loading: false,
          subtitle: `Permits revoked successfully for ${operator.address.slice(0, 6)}...${operator.address.slice(
            operator.address.length - 4
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

  const revokeAccess = async (full: boolean = false, contractAddress: string, selector?: string) => {
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
        let txHash = await contract.contract.permit_all_rights_in_contract(operator.address, contractAddress, 0);
        if (!txHash) {
          return;
        }
        await wait(txHash.transaction_hash);
      } else {
        let txHash = await contract.contract.permit(operator.address, contractAddress, selector, 0);
        if (!txHash) {
          return;
        }
        await wait(txHash.transaction_hash);
      }

      // Update UI
      if (full) {
        const full = operator.full;
        const idx = full.findIndex((p) => p.contract === contractAddress);
        if (idx >= 0) {
          full.splice(idx, 1);
        }
        updatePermits(operator.address, [...operator.full, ...operator.partial]);
      } else {
        const partial = operator.partial;
        const idx = partial.findIndex((p) => p.rights === selector);
        if (idx >= 0) {
          partial.splice(idx, 1);
        }
        updatePermits(operator.address, [...operator.full, ...partial]);
      }

      // Hide loading modal
      hideModal();

      // Show success modal
      showModal(
        MODAL_TYPE.TRANSACTION_FLOW,
        {
          loading: false,
          subtitle: `Permit revoked successfully for ${operator.address.slice(0, 6)}...${operator.address.slice(
            operator.address.length - 4
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
      <div className="flex flex-row justify-between flex-wrap">
        <div className="flex flex-row items-center gap-2">
          <PersonIcon />
          <div className="font-outfit font-semibold text-2xl">
            {operator.address
              ? `${operator.address.slice(0, 6)}...${operator.address.slice(operator.address.length - 4)}`
              : "--"}
          </div>
        </div>
        <div className="flex-nowrap ml-auto">
          <Button
            style="tertiary-colored"
            shadow={false}
            onClick={() => {
              showModal(
                MODAL_TYPE.TRANSACTION_FLOW,
                {
                  loading: actionLoading,
                  subtitle: `Are you sure you want to revoke all permits from ${operator.address.slice(
                    0,
                    6
                  )}...${operator.address.slice(operator.address.length - 4)}?`,
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
                Contract
              </th>
              <th scope="row" className="py-2 px-4">
                Selector
              </th>
              <th scope="row" className="py-2 px-4">
                Remaining Permit Allowance
              </th>
              <th scope="row" className="py-2 px-4">
                Permit Timestamp
              </th>
              <th scope="row" className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {operator.full.map((p, idx) => (
              <tr key={`${operator.address}-full-${idx}`}>
                <td className="py-2 px-4">{`${p.contract.slice(0, 6)}...${p.contract.slice(
                  p.contract.length - 4
                )}`}</td>
                <td className="py-2 px-4">*</td>
                <td className="py-2 px-4">Unlimited</td>
                <td className="py-2 px-4">{new Date(Number(p.creationTimestamp) * 1000).toLocaleString()}</td>
                <td className="text-right">
                  <Button
                    style="tertiary-colored"
                    shadow={false}
                    onClick={() => {
                      showModal(
                        MODAL_TYPE.TRANSACTION_FLOW,
                        {
                          loading: actionLoading,
                          subtitle: `Are you sure you want to revoke full access from ${operator.address.slice(
                            0,
                            6
                          )}...${operator.address.slice(operator.address.length - 4)} for contract ${p.contract.slice(
                            0,
                            6
                          )}...${p.contract.slice(p.contract.length - 4)}?`,
                          okButtonText: "Revoke Permit",
                          okButtonCallback: async () => {
                            await revokeAccess(true, p.contract);
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
            {operator.partial.map((p, idx) => (
              <tr key={`${operator.address}-partial-${idx}`}>
                <td className="py-2 px-4">{`${p.contract.slice(0, 6)}...${p.contract.slice(
                  p.contract.length - 4
                )}`}</td>
                <td className="py-2 px-4">{`${p.rights.slice(0, 6)}...${p.rights.slice(p.rights.length - 4)}`}</td>
                <td className="py-2 px-4">{p.number.toString()}</td>
                <td className="py-2 px-4">{new Date(Number(p.creationTimestamp) * 1000).toLocaleString()}</td>
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
                          )} permit from ${operator.address.slice(0, 6)}...${operator.address.slice(
                            operator.address.length - 4
                          )} for contract ${p.contract.slice(0, 6)}...${p.contract.slice(p.contract.length - 4)}?`,
                          okButtonText: "Revoke Permit",
                          okButtonCallback: async () => {
                            await revokeAccess(false, p.contract, p.rights);
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

export default OperatorCard;
