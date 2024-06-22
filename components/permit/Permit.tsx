import { useAccount } from "@starknet-react/core";
import Sidebar from "../common/Sidebar";
import ContractCard from "./ContractCard";
import { useEffect, useState } from "react";
import { NotFoundIcon } from "../icons/NotFoundIcon";

function Landing() {
  const [contracts, handleContracts] = useState<
    Map<
      string,
      {
        address: string;
        full: Permit[];
        partial: Permit[];
      }
    >
  >();

  const { account } = useAccount();

  useEffect(() => {
    if (!account) {
      return;
    }
    const searchAddr = account.address.length % 2 === 0 ? account.address : `0x0${account.address.substring(2)}`;
    (async () => {
      await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `{\r\n  permits(where: {from: \"${searchAddr}\", number_gt: \"0\"}) {\r\n    contract\r\n    creationTimestamp\r\n    creationTransactionHash\r\n    from\r\n    id\r\n    number\r\n    operator\r\n    rights\r\n  }\r\n}`
        })
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.data?.permits) {
            const obj: Map<string, { address: string; full: Permit[]; partial: Permit[] }> = new Map();
            for (let p of response.data.permits as Permit[]) {
              const arr = obj.get(p.contract) ?? { address: p.contract, full: [], partial: [] };
              if (p.rights === "0x0800000000000011000000000000000000000000000000000000000000000000") {
                // Permit all rights for contract
                arr.full.push(p);
              } else {
                // Permit partial rights for contract
                arr.partial.push(p);
              }
              obj.set(p.contract, arr);
            }
            handleContracts(obj);
          }
        });
    })();
  }, [account]);

  if (!account) {
    return (
      <>
        <div className="w-screen h-full min-h-screen flex">
          <div className="pt-16 flex max-w-7xl mx-auto w-full">
            <Sidebar activeIdx={1} />
            <div className="h-full w-full flex flex-col gap-4 p-6 md:p-12">
              <div className="w-full flex flex-col bg-dark-2 border border-[#1F2328] rounded-lg p-12">
                <NotFoundIcon className="mx-auto" />
                <div className="mt-4 font-outfit text-2xl mx-auto font-semibold">Wallet Not Connected</div>
                <div className="text-sm font-medium mx-auto mt-1">Please connect your wallet to view your permits.</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const updateContract = (contract: { address: string; full: Permit[]; partial: Permit[] }) => {
    const c = new Map(contracts);
    if (contract.full.length === 0 && contract.partial.length === 0) {
      c.delete(contract.address);
      handleContracts(c);
    } else {
      c.set(contract.address, contract);
    }

    handleContracts(c);
  };

  const renderContracts = () => {
    let ret: JSX.Element[] = [];
    contracts && contracts.forEach((c) => ret.push(<ContractCard contract={c} updateContract={updateContract} />));
    return <>{...ret}</>;
  };

  return (
    <>
      <div className="w-screen h-full min-h-screen flex">
        <div className="pt-16 flex max-w-7xl mx-auto w-full">
          <Sidebar activeIdx={1} />
          <div className="h-full w-full flex flex-col gap-4 p-6 md:p-12">{renderContracts()}</div>
        </div>
      </div>
    </>
  );
}

export default Landing;
