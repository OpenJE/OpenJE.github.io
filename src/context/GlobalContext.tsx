import type React from "react";
import { createContext, useContext } from "react";
import DatabaseProvider from "./DatabaseContext";

interface GlobalContextType {}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
	const context = useContext(GlobalContext);
	if (!context)
		throw new Error("useGlobalContext must be used within a AppProvider");
	return context;
};

type Props = {
	children?: React.ReactNode;
};

/**
 * The App provider component
 * @param { Props } props props { children?: React.ReactNode }
 * @returns { React.JSX.Element } The App provider component
 */
const GlobalProvider: React.FC<React.PropsWithChildren<object>> = (
	props: Props,
): React.JSX.Element => {
	const { children } = props;

	return (
		<GlobalContext.Provider value={{}}>
      <DatabaseProvider>
        {children}
      </DatabaseProvider>
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;
