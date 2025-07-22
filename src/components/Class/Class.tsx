import React, { useState } from 'react';

import MemberData, { Member } from './Member/Member';
import MethodData, { Method } from './Method/Method';
import VTableData, { VTable } from './VTable/VTable';
import './Class.css';

export type Structure = {
  demangled_name: string,
  members: Map<string, Member>,
  methods: Map<string, Method>,
  name: string,
  size: number,
  vftables: Map<string, VTable>
}

export default function Class( className: string, structure: Structure ) {
  if ( !structure ) {
    return <div>Class not found!</div>;
  }

  const [ showBase, setShowBase ] = useState( false );

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

  function getMemberType( memberType: string, memberSize: number ): "int8" | "int16" | "int32" | "int64" | "struct" | "unknown" {
    if ( memberType === '' ) {
      if ( memberSize <= 1 ) return "int8";
      if ( memberSize <= 2 ) return "int16";
      if ( memberSize <= 4 ) return "int32";
      if ( memberSize <= 8 ) return "int64";
    } else if ( memberType === 'struc' ) {
      return "struct"; // If it's a struct, we return struct type
    }
    return "unknown";
  }

  function getClassOrStruct( mangledName: string ): "class" | "struct" {
    if ( !mangledName ) return "class";
    if ( mangledName.startsWith( '.?AV' ) ) return "class";
    if ( mangledName.startsWith( '.?AU' ) ) return "struct";
    return "class";
  }

  const info = () => (
    <table className="members-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Hierarchy</th>
          <th>Size</th>
          <th># Members</th>
          <th># Methods</th>
          <th># VFTables</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{ getClassOrStruct( structure.name ) }</td>
          <td>{ isBaseClass(structure) ? 'Base' : isDerivedClass(structure) ? 'Derived' : 'Unknown' }</td>
          <td>{ `${structure.size} (0x${structure.size.toString(16).toUpperCase()})` }</td>
          <td>{ Object.keys( structure.members ).length }</td>
          <td>{ Object.keys( structure.methods ).length }</td>
          <td>{ Object.keys( structure.vftables ).length }</td>
        </tr>
      </tbody>
    </table>
  );

  const members = () => (
    <table className="members-table">
      <thead>
        <tr>
          <th>Offset</th>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
          <th>Parent</th>
          <th>Base
        <input
          type="checkbox"
          id="base"
          name="base"
          value="Base"
          defaultChecked={ showBase }
          onChange={ ( e ) => setShowBase( e.target.checked ) }
        />
          </th>
        </tr>
      </thead>
      <tbody>
        { Object.entries( structure.members )
          .filter(( [ , member ] ) => showBase || !member.base )
          .sort( ( [ offsetA ], [ offsetB ]  ) => Number( offsetA ) - Number( offsetB ) )
          .map(( [ offset, member ] ) => (
        <tr key={ offset }>
          { MemberData( offset, member ) }
        </tr>
          ))}
      </tbody>
    </table>
  );

  const methods = () => (
    <table className="methods-table">
      <thead>
        <tr>
          <th>Effective Address</th>
          <th>Name</th>
          <th>Type</th>
          <th>Import</th>
        </tr>
      </thead>
      <tbody>
        { Object.entries( structure.methods ).map( ( [ ea, method ] ) => (
          <tr key={ ea }>
            { MethodData( ea, method ) }
          </tr>
        ))}
      </tbody>
    </table>
  );

  const vtables = () => (
    <table className="vtables-table">
      <thead>
        <tr>
          <th>Effective Address</th>
          <th>Length</th>
        </tr>
      </thead>
      <tbody>
        { Object.entries( structure.vftables ).map( ( [ ea, vftable ] ) => (
          <tr >
            { VTableData( ea, vftable ) }
          </tr>
        ))}
      </tbody>
    </table>
  );

  const parents = () => (
    <table className="parents-table">
      <thead>
        <tr>
          <th>Parent</th>
          <th>Offset</th>
        </tr>
      </thead>
      <tbody>
        { Object.entries(structure.members)
          .filter(([ , member ]) => member.parent && !member.base)
          .map(([ offset, member ]) => (
            <tr key={offset}>
              <td>{member.struc}</td>
              <td>{offset}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  function cppClass(structure: Structure): string {
    const classOrStruct = getClassOrStruct(structure.name);
    const name = structure.demangled_name || structure.name;

    // Parents (base classes)
    const parents = Object.values(structure.members)
      .filter(m => m.parent && !m.base)
      .map(m => m.struc)
      .join(", ");

    // Members
    const members = Object.entries(structure.members)
      .filter(([ , m ]) => !m.parent) // skip parent pointers
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([ , m ]) => `    ${getMemberType(m.type, m.size)} ${m.name};`)
      .join("\n");

    // Methods
    const methods = Object.values(structure.methods)
      .map(m => `    ${m.name}();`)
      .join("\n");

    return `${classOrStruct} ${name}${parents ? " : " + parents : ""} {\npublic:\n${members}\n\n${methods}\n};`;
  }

  return (
    <section className="class-container">
      <h2>{ structure.demangled_name || className }</h2>
      { info() }
      <h3>Parents</h3>
      { parents() }
      <h3>Members</h3>
      { members() }
      <h3>Methods</h3>
      { methods() }
      <h3>VFTables</h3>
      { vtables() }
      <h3>Pseudocode</h3>
      <pre>
        <code>
          { cppClass( structure ) }
        </code>
      </pre>
    </section>
  );
};
