import React from 'react';
import { Container, Table } from 'react-bootstrap';
import Member from './Member/Member';
import Method from './Method/Method';
import VTable from './VTable/VTable';
import './Class.css';

export default function Class( className: string, structure ) {
  if ( !structure ) {
    return <div>Class not found!</div>;
  }

  return (
    <Container className="class-container">
      <h2>{ structure.demangled_name || className }</h2>
      <h3>Members</h3>
      <Table className="members-table">
        <thead>
          <tr>
            <th>Offset</th>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
        { Object.entries( structure.members ).map( ( [ offset, member ] ) => (
          <tr key={ offset }>
            { Member( offset, member ) }
          </tr>
        ))}
        </tbody>
      </Table>
      <h3>Methods</h3>
      <Table className="methods-table">
        <thead>
          <tr>
            <th>Effective Address</th>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          { Object.entries( structure.methods ).map( ( [ ea, method ] ) => (
            <tr key={ ea }>
              { Method( ea, method ) }
            </tr>
          ))}
        </tbody>
      </Table>
      <h3>VTables</h3>
      <Table className="vtables-table">
        <thead>
          <tr>
            <th>Effective Address</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>
          { Object.entries( structure.vftables ).map( ( [ ea, vftable ] ) => (
            <tr key={ ea }>
              { VTable( ea, vftable ) }
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
