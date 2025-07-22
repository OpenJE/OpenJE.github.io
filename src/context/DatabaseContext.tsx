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
      // Convert members and possibly other properties to Map if needed
      const members = new Map<string, any>(Object.entries(structureObj.members || {}));
      // If there are other properties that need conversion, do it here
      const structure: Structure = {
        ...structureObj,
        members,
      };
      return [className, structure] as [string, Structure];
    });

    if (filterFn) {
      entries = entries.filter(([className, structure]) => filterFn(className, structure));
    }
    if (options?.sortDirection) {
      entries.sort(([a], [b]) =>
        options.sortDirection === "ascending"
          ? a.localeCompare(b)
          : b.localeCompare(a)
      );
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
