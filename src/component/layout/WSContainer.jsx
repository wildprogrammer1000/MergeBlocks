import { Outlet } from "react-router-dom";
import NetworkController from "../NetworkController";

const WSContainer = () => {
  return (
    <>
      <NetworkController />
      <Outlet />
    </>
  );
};

export default WSContainer;
