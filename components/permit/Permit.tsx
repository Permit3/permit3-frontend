import { useAccount } from "@starknet-react/core";
import Sidebar from "../common/Sidebar";
import ContractCard from "./ContractCard";
import { useEffect, useMemo, useState } from "react";
import { NotFoundIcon } from "../icons/NotFoundIcon";
import OperatorCard from "./OperatorCard";

function Landing() {
  const [permits, handlePermits] = useState<Permit[]>([]);

  const { account } = useAccount();

  const contracts = useMemo(() => {
    const cObj: Map<string, { address: string; full: Permit[]; partial: Permit[] }> = new Map();
    for (let p of permits as Permit[]) {
      const cArr = cObj.get(p.contract) ?? { address: p.contract, full: [], partial: [] };
      if (p.rights === "0x0800000000000011000000000000000000000000000000000000000000000000") {
        // Permit all rights to operator for contract
        cArr.full.push(p);
      } else {
        // Permit partial rights to operator for contract
        cArr.partial.push(p);
      }
      cObj.set(p.contract, cArr);
    }

    return cObj;
  }, [permits]);

  const operators = useMemo(() => {
    const oObj: Map<string, { address: string; full: Permit[]; partial: Permit[] }> = new Map();
    for (let p of permits as Permit[]) {
      const oArr = oObj.get(p.operator) ?? { address: p.operator, full: [], partial: [] };
      if (p.rights === "0x0800000000000011000000000000000000000000000000000000000000000000") {
        // Permit all rights to operator for contract
        oArr.full.push(p);
      } else {
        // Permit partial rights to operator for contract
        oArr.partial.push(p);
      }
      oObj.set(p.operator, oArr);
    }
    return oObj;
  }, [permits]);

  const updateContractPermits = (contract: string, newPermits: Permit[]) => {
    const existingPermits = permits.filter((p) => p.contract !== contract);
    handlePermits([...existingPermits, ...newPermits]);
  };

  const updateOperatorPermits = (operator: string, newPermits: Permit[]) => {
    const existingPermits = permits.filter((p) => p.operator !== operator);
    handlePermits([...existingPermits, ...newPermits]);
  };

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
            handlePermits(response.data.permits);
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

  const renderContracts = () => {
    let ret: JSX.Element[] = [];
    // Render by contract
    // contracts &&
    //   contracts.forEach((c) => ret.push(<ContractCard contract={c} updatePermits={updateContractPermits} />));
    // Render by operator
    operators &&
      operators.forEach((o) => ret.push(<OperatorCard operator={o} updatePermits={updateOperatorPermits} />));
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
