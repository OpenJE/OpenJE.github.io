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

  const info = () => (
    <table className="members-table">
      <thead>
        <tr>
          <th>Size</th>
          <th># Members</th>
          <th># Methods</th>
          <th># VTables</th>
        </tr>
      </thead>
      <tbody>
        <tr>
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
      <h3>VTables</h3>
      { vtables() }
    </section>
  );
};
