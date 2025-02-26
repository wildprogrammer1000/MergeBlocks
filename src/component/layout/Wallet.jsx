import { useNakama } from "@/providers/NakamaProvider";
import { useEffect, useState } from "react";
import WalletDiamond from "@/component/ui/WalletDiamond";

const Wallet = () => {
  const { account } = useNakama();
  const [diamond, setDiamond] = useState(0);
  const getPoint = () => {
    if (!account) return;
    const wallet = JSON.parse(account.wallet);
    setDiamond(wallet.diamond || 0);
  };
  useEffect(() => {
    getPoint();
  }, [account]);
  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <WalletDiamond type="diamond" value={diamond} />
    </div>
  );
};

export default Wallet;
