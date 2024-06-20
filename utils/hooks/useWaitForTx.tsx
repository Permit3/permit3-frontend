import { UseWaitForTransactionResult, useWaitForTransaction } from "@starknet-react/core";
import { useEffect, useRef, useState } from "react";

function useWaitForTx() {
  const [hash, handleHash] = useState<string>();
  const hashRef = useRef<string>();
  const resultRef = useRef<any>(null);
  const result = useWaitForTransaction({
    hash: hash
  });

  useEffect(() => {
    hashRef.current = hash;
  }, [hash]);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const waitForLoaded = async (txHash: string) => {
    if (!resultRef.current.isLoading && resultRef.current.status !== "pending" && txHash === hashRef.current) {
      return true;
    }
    return false;
  };

  const wait = async (txHash: string) => {
    if (!txHash) {
      return;
    }

    handleHash(txHash);
    return new Promise<UseWaitForTransactionResult>((resolve) => {
      const int = setInterval(async () => {
        const res = await waitForLoaded(txHash);
        if (res) {
          clearInterval(int);
          resolve(resultRef.current);
        }
      }, 100);
    });
  };

  return { wait };
}

export default useWaitForTx;
