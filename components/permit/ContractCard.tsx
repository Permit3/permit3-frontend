import { PersonIcon } from "../icons/PersonIcon";
import Pill from "../ui/Pill";
import Button from "../ui/forms/Button";

interface ContractCardProps {
  address?: string;
}

function ContractCard(props: ContractCardProps) {
  const { address } = props;
  const name = "Decentraland";
  return (
    <div className="rounded-lg bg-dark-2 p-4 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <PersonIcon />
          <div className="font-outfit font-semibold text-2xl">
            {address ? `${address.slice(0, 6)}...${address.slice(address.length - 4)}` : "--"}
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
          <tbody>
            <tr>
              <td className="py-2 px-4">{"3ac225...5f1cb"}</td>
              <td className="py-2 px-4">{"5"}</td>
              <td className="text-right">
                <Button style="tertiary-colored">Revoke</Button>
              </td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="py-2 px-4">{"4bc235...52ceb"}</td>
              <td className="py-2 px-4">{"3"}</td>
              <td className="text-right">
                <Button style="tertiary-colored">Revoke</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContractCard;
