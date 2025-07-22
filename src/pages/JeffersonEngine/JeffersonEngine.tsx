import React from 'react';

import { useDatabaseContext } from '../../context/DatabaseContext';
import Class, { Structure } from '../../components/Class/Class';

import './JeffersonEngine.css';

export default function VanBuren() {
  const { queryClasses } = useDatabaseContext();

  const [ currentClass, setCurrentClass ] = React.useState<string | null>( null );
  const [ searchQuery, setSearchQuery ] = React.useState<string>('');
  const [ hideBaseClasses, setHideBaseClasses ] = React.useState(false);
  const [ hideDerivedClasses, setHideDerivedClasses ] = React.useState(false);
  const [ sortDirection, setSortDirection ] = React.useState<"ascending" | "descending">("ascending");

  const filterFn = (name: string, structure: Structure) => {
    const demangledName = structure.demangled_name || name;
    if (
      demangledName.includes("Game") ||
      demangledName.includes("std") ||
      demangledName.includes("__non_rtti_object") ||
      demangledName.includes("bad_") ||
      demangledName.includes("type_") ||
      demangledName.includes("PipBoy") &&
      !demangledName.includes("CGameFloatingTextInterface") &&
      !demangledName.includes("CGameInterface") &&
      !demangledName.includes("COptionsGameInterface") ||
      !demangledName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    const members = Array.from(structure.members.values());
    const isBaseClass = !members.some((member: any) => member.parent && !member.base);
    const isDerivedClass = members.some((member: any) => member.parent && !member.base);

    if (hideBaseClasses && isBaseClass) return false;
    if (hideDerivedClasses && isDerivedClass) return false;
    return true;
  };

  const classes = queryClasses(filterFn, { sortDirection: sortDirection });

  const Sidebar = () => (
    <aside>
      <form onSubmit={ ( e ) => e.preventDefault() }>
        <input
          type="text"
          placeholder="Search..."
          value={ searchQuery }
          onChange={ ( e ) => {
            setSearchQuery( e.target.value );
            e.stopPropagation();
          }}
        />
        <label>
          Sort Direction:
          <select
            value={sortDirection}
            onChange={e => setSortDirection(e.target.value as "ascending" | "descending")}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={ hideBaseClasses }
            onChange={ e => setHideBaseClasses( e.target.checked ) }
          />
          Hide Base Classes
        </label>
        <label>
          <input
            type="checkbox"
            checked={ hideDerivedClasses }
            onChange={ e => setHideDerivedClasses( e.target.checked ) }
          />
          Hide Derived Classes
        </label>
        <ul>
          { Array.from(classes.entries()).map(([name, structure]) => (
            <li key={ name }>
              <button
                type="button" // Ensure the button doesn't submit the form
                onClick={ () => setCurrentClass( name ) }
              >
                { structure.demangled_name || name }
              </button>
            </li>
          ))}
        </ul>
      </form>
    </aside>
  );

  const ClassContent = () => (
    <section className="class-content">
      {currentClass && classes.has(currentClass) &&
        Class(currentClass, classes.get(currentClass) as Structure)
      }
    </section>
  );

  return (
    <article className="jefferson-engine">
      <section className="jefferson-engine-header">
        <h1>Jefferson Engine</h1>
      </section>
      <section className="class-list">
        <Sidebar/>
        <ClassContent/>
      </section>
    </article>
  );
}
