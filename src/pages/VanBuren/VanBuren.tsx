import React from 'react';

import Class, { Structure } from '../../components/Class/Class';
import data from '../../assets/F3.json';

import './VanBuren.css';

export default function VanBuren() {
  const [ currentClass, setCurrentClass ] = React.useState<string | null>( null );
  const [ searchQuery, setSearchQuery ] = React.useState<string>('');
  const [ hideBaseClasses, setHideBaseClasses ] = React.useState(false);
  const [ hideDerivedClasses, setHideDerivedClasses ] = React.useState(false);

  // Helper: is this class a base class (no parents)?
  function isBaseClass( structure: Structure ) {
    return !Object.values( structure.members ).some(
      ( member: any ) => member.parent && !member.base
    );
  }

  // Helper: is this class a base class (no parents)?
  function isDerivedClass( structure: Structure ) {
    return Object.values( structure.members ).some(
      ( member: any ) => member.parent && !member.base
    );
  }

  // Filter classes based on the search query
  const filteredClasses = Object.keys( data.structures ).filter( ( className ) => {
    const structure = data.structures[ className as keyof typeof data.structures ] as unknown as Structure;
    const demangledName = structure.demangled_name || className;
    if (
      !demangledName.includes( "Game" ) &&
      !demangledName.includes( "PipBoy" ) ||
      demangledName.includes( "CGameFloatingTextInterface" ) ||
      demangledName.includes( "CGameInterface" ) ||
      demangledName.includes( "COptionsGameInterface" ) ||
      !demangledName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if ( hideBaseClasses && isBaseClass( structure ) ) {
      return false;
    }
    if ( hideDerivedClasses && isDerivedClass( structure ) ) {
      return false;
    }
    return true;
  });

  const sortedClasses = filteredClasses.sort((a, b) => {
    const aName = data.structures[a as keyof typeof data.structures].demangled_name || a;
    const bName = data.structures[b as keyof typeof data.structures].demangled_name || b;
    return aName.localeCompare(bName);
  });

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
          { sortedClasses.map( ( className ) => (
            <li key={ className }>
              <button
                type="button" // Ensure the button doesn't submit the form
                onClick={ () => setCurrentClass( className ) }
              >
                { data.structures[ className as keyof typeof data.structures ].demangled_name || className }
              </button>
            </li>
          ))}
        </ul>
      </form>
    </aside>
  );

  const ClassContent = () => (
    <section className="class-content">
      { currentClass && Class( currentClass, data.structures[ currentClass as keyof typeof data.structures ] as unknown as Structure ) }
    </section>
  );

  return (
    <article className="van-buren">
      <section className="van-buren-header">
        <h1>Fallout: Van Buren</h1>
      </section>
      <section className="class-list">
        <Sidebar/>
        <ClassContent/>
      </section>
    </article>
  );
}
