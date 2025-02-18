import Version from "../ui/Version";
import Wallet from "./Wallet";

const Header = () => {
  return (
    <div className="absolute top-0 left-0 w-full">
      <Version visible={true}/>
      {/* <Wallet /> */}
    </div>
  );
};

export default Header;
