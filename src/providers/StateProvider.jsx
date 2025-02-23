import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const StateContext = createContext();
export const StateProvider = ({ children }) => {
  const [view, setView] = useState(0);
  return (
    <StateContext.Provider value={{ view, setView }}>
      {children}
    </StateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a StateProvider");
  }
  return context;
};
export default StateProvider;

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
