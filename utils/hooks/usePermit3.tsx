import { useContract } from "@starknet-react/core";
import Permit3Abi from "@/assets/abi/Permit3.json";

function usePermit3() {
  const contract = useContract({ address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERMIT3, abi: Permit3Abi });

  return { contract };
}

export default usePermit3;
