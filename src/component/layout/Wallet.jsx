import { useNakama } from "@/providers/NakamaProvider";
import { useEffect, useState } from "react";
import WalletDiamond from "@/component/ui/WalletDiamond";

const Wallet = () => {
  const { wallet, refreshAccount } = useNakama();
  useEffect(() => {
    refreshAccount();
  }, []);
  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <WalletDiamond type="diamond" value={wallet.diamond || 0} />
    </div>
  );
};

export default Wallet;
