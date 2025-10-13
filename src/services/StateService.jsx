import {createContext, useContext, useState} from "react";

export const States = Object.freeze({EXPLORE: 0, WORK: 1, ABOUT: 2})

const StateContext = createContext(null);

export const StateProvider = ({ children }) => {
  const [state, setState] = useState(States.EXPLORE);
  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};


export const useStateManager = () => useContext(StateContext);