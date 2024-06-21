import { PersonIcon } from "../icons/PersonIcon";
import Button from "../ui/forms/Button";

interface ContractCardProps {
  contract: {
    address: string;
    full: Permit[];
    partial: Permit[];
  };
}

function ContractCard(props: ContractCardProps) {
  const { contract } = props;
  const full = contract.full.filter((p) => BigInt(p.number) > BigInt(0));
  const partial = contract.partial.filter((p) => BigInt(p.number) > BigInt(0));

  return (
    <div className="rounded-lg bg-dark-2 border border-[#1F2328] p-4 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <PersonIcon />
          <div className="font-outfit font-semibold text-2xl">
            {contract.address
              ? `${contract.address.slice(0, 6)}...${contract.address.slice(contract.address.length - 4)}`
              : "--"}
          </div>
        </div>
        <div className="flex-nowrap">
          <Button style="tertiary-colored">Revoke All Access</Button>
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
            {full.map((p, idx) => (
              <tr key={`${contract.address}-full-${idx}`}>
                <td className="py-2 px-4">*</td>
                <td className="py-2 px-4">{p.number.toString()}</td>
                <td className="text-right">
                  <Button style="tertiary-colored">Revoke</Button>
                </td>
              </tr>
            ))}
            {partial.map((p, idx) => (
              <tr key={`${contract.address}-partial-${idx}`}>
                <td className="py-2 px-4">{`${p.rights.slice(0, 6)}...${p.rights.slice(p.rights.length - 4)}`}</td>
                <td className="py-2 px-4">{p.number.toString()}</td>
                <td className="text-right">
                  <Button style="tertiary-colored">Revoke</Button>
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
