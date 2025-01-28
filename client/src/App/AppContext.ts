import {createContext} from "react";

export interface AppContext {
  isMobile: boolean;
}

const defaultContext: AppContext = {
  isMobile: false,
};

export default createContext(defaultContext);