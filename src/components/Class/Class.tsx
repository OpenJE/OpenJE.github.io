import { Container, Table } from 'react-bootstrap';
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

  const members = () => (
    <Table className="members-table">
      <thead>
        <tr>
          <th>Offset</th>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
      { Object.entries( structure.members ).map( ( [ offset, member ] ) => (
        <tr key={ offset }>
          { MemberData( offset, member ) }
        </tr>
      ))}
      </tbody>
    </Table>
  );

  const methods = () => (
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
            { MethodData( ea, method ) }
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const vtables = () => (
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
            { VTableData( ea, vftable ) }
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Container className="class-container">
      <h2>{ structure.demangled_name || className }</h2>
      <h3>Members</h3>
      { members() }
      <h3>Methods</h3>
      { methods() }
      <h3>VTables</h3>
      { vtables() }
    </Container>
  );
};
