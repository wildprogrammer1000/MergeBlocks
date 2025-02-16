import { useNakama } from "@/providers/NakamaProvider";
import WalletPoint from "../ui/WalletPoint";
import { useEffect, useState } from "react";

const Wallet = () => {
  const { account } = useNakama();
  const [point, setPoint] = useState(0);
  const getPoint = () => {
    if (!account) return;
    const wallet = JSON.parse(account.wallet);
    setPoint(wallet.point || 0);
  };
  useEffect(() => {
    getPoint();
  }, [account]);
  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <WalletPoint type="point" value={point} />
    </div>
  );
};

export default Wallet;
