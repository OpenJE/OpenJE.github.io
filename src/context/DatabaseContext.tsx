import React, { createContext, useContext } from "react";
import data from '../assets/F3.json';
import { Structure } from '../components/Class/Class';

interface DatabaseContextType {
  queryClasses: (
    filterFn?: (className: string, structure: Structure) => boolean,
    options?: { sortDirection?: "ascending" | "descending" }
  ) => Map<string, Structure>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context)
    throw new Error("useDatabaseContext must be used within a DatabaseProvider");
  return context;
};
const DatabaseProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const queryClasses = (
    filterFn?: (className: string, structure: Structure) => boolean,
    options?: { sortDirection?: "ascending" | "descending" }
  ): Map<string, Structure> => {
    // Convert plain objects to Structure with Map members
    const structures: Record<string, any> = data.structures;
    let entries = Object.entries(structures).map(([className, structureObj]) => {
      const members = new Map<string, any>(Object.entries(structureObj.members || {}));
      const methods = new Map<string, any>(Object.entries(structureObj.methods || {}));
      const vftables = new Map<string, any>(Object.entries(structureObj.vftables || {}));
      const structure: Structure = {
        ...structureObj,
        members,
        methods,
        vftables,
      };
      return [className, structure] as [string, Structure];
    });

    if (filterFn) {
      entries = entries.filter(([className, structure]) => filterFn(className, structure));
    }
    if (options?.sortDirection) {
      entries.sort(([nameA, structA], [nameB, structB]) => {
        const aName = structA.demangled_name || nameA;
        const bName = structB.demangled_name || nameB;
        return options?.sortDirection === "ascending"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
    }
    const map = new Map<string, Structure>(entries);
    return map;
  };

  return (
    <DatabaseContext.Provider value={{ queryClasses }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;
