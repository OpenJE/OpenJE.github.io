import React, { createContext, useContext } from "react";
import data from '../assets/F3.json';
import { Structure } from '../components/Class/Class';

type QueryFilter = (structure: Structure, className: string) => boolean;

interface DatabaseContextType {
  queryDatabase: (filter: QueryFilter) => Array<{ className: string, structure: Structure }>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context)
    throw new Error("useDatabaseContext must be used within a DatabaseProvider");
  return context;
};

const DatabaseProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  function queryDatabase(filter: QueryFilter) {
    return Object.entries(data.structures)
      .filter(([className, structure]) => filter(structure as Structure, className))
      .map(([className, structure]) => ({
        className,
        structure: structure as unknown as Structure
      }));
  }

  return (
    <DatabaseContext.Provider value={{ queryDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;
