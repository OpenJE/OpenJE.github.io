import React, { useState } from 'react';
import { useDatabaseContext } from '../../context/DatabaseContext';

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

function demangleMsvcClass(mangled: string): string {
  // Check for the basic pattern
  if (!mangled.startsWith('.?') || !mangled.endsWith('@@')) {
      return mangled; // Not a mangled class/struct name
  }

  // Remove leading '?' and trailing '@@'
  let core = mangled.slice(4, -2);

  // Split by '@' and remove empty parts
  let parts = core.split('@').filter(Boolean);

  // The order is inner-to-outer, so reverse for C++ style
  return parts.reverse().join('::');
}

function formatMemberName(mangled: string): string {
  // Handle member names like '.?AUAction@@_0x0' or '.?AVStringSystem@SS@@_0x0'
  // Extract the mangled part before any suffix like '_0x0'
  const match = mangled.match(/^(\.\?[AUV][A-Za-z0-9_@]+@@)/);
  let coreMangled = mangled;
  let suffix = '';

  if (match) {
    coreMangled = match[1];
    suffix = mangled.slice(coreMangled.length);
  }

  // Check for the basic pattern
  if (!coreMangled.startsWith('.?') || !coreMangled.endsWith('@@')) {
    return mangled.toLowerCase(); // Not a mangled class/struct name, just lowercase
  }

  // Remove leading '.?' and trailing '@@'
  let core = coreMangled.slice(4, -2);

  // Split by '@' and remove empty parts
  let parts = core.split('@').filter(Boolean);

  // The order is inner-to-outer, so reverse for C++ style
  // Only keep the innermost name (last after reverse)
  const demangled = parts.length > 0 ? parts[0].toLowerCase() : mangled.toLowerCase();

  // Append any suffix (like '_0x0') back
  return demangled + suffix.toLowerCase();
}

export interface StructureAncestorTreeNode {
  structure: Structure;
  ancestors: StructureAncestorTreeNode[];
}

export function findAncestorTree(
  structure: Structure,
  getStructureByMangledName: (mangled: string) => Structure | undefined,
  visited: Set<string> = new Set()
): StructureAncestorTreeNode {
  const ancestors: StructureAncestorTreeNode[] = [];

  for (const member of structure.members.values()) {
    if (member.parent && !member.base && member.struc && !visited.has(member.struc)) {
      const parentStruct = getStructureByMangledName(member.struc);
      if (parentStruct) {
        visited.add(member.struc);
        ancestors.push(findAncestorTree(parentStruct, getStructureByMangledName, visited));
      }
    }
  }

  return {
    structure,
    ancestors
  };
}

export interface StructureOffspringTreeNode {
  structure: Structure;
  offspring: StructureOffspringTreeNode[];
}

export function findOffspringTree(
  structure: Structure,
  allStructures: Map<string, Structure>,
  visited: Set<string> = new Set()
): StructureOffspringTreeNode {
  const offspring: StructureOffspringTreeNode[] = [];
  const thisMangled = structure.name;

  for (const candidate of allStructures.values()) {
    for (const member of candidate.members.values()) {
      if (
        member.parent &&
        !member.base &&
        member.struc === thisMangled &&
        !visited.has(candidate.name)
      ) {
        visited.add(candidate.name);
        offspring.push(findOffspringTree(candidate, allStructures, visited));
        break;
      }
    }
  }

  return {
    structure,
    offspring
  };
}

export default function Class( name: string, structure: Structure ) {
  const { queryClasses } = useDatabaseContext();
  const [ showBase, setShowBase ] = useState( false );

  if ( !structure ) {
    return <div>Class not found!</div>;
  }

  // Helper: is this class a base class (no parents)?
  function isBaseClass( structure: Structure ) {
    return !Array.from(structure.members.values()).some(
      ( member: any ) => member.parent && !member.base
    );
  }

  // Helper: is this class a base class (no parents)?
  function isDerivedClass( structure: Structure ) {
    return Array.from(structure.members.values()).some(
      ( member: any ) => member.parent && !member.base
    );
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
          <th>Mangled</th>
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
          <td>{ structure.name }</td>
          <td>{ getClassOrStruct( structure.name ) }</td>
          <td>{ isBaseClass(structure) ? 'Base' : isDerivedClass(structure) ? 'Derived' : 'Unknown' }</td>
          <td>{ `${structure.size} (0x${structure.size.toString(16).toUpperCase()})` }</td>
          <td>{structure.members.size}</td>
          <td>{structure.methods.size}</td>
          <td>{structure.vftables.size}</td>
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
        { Array.from(structure.members.entries())
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
        { Array.from(structure.methods.entries()).map(([ea, method]) => (
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
        { Array.from(structure.vftables.entries()).map(([ea, vftable]) => (
          <tr key={ea}>
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
        { Array.from(structure.members.entries())
          .filter(([ , member ]) => member.parent && !member.base)
          .map(([ offset, member ]) => (
            <tr key={offset}>
              <td>{demangleMsvcClass(member.struc)}</td>
              <td>{offset}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  function inheritance() {
    const allStructures = queryClasses();
    const getStructureByMangledName = (mangled: string) => allStructures.get(mangled);

    // Build the ancestor and offspring trees
    const ancestorTreeData = findAncestorTree(structure, getStructureByMangledName);
    const offspringTreeData = findOffspringTree(structure, allStructures);

    // Merge the two trees at the current class node
    function mergeAncestryAndOffspring(
      ancestorNode: StructureAncestorTreeNode,
      offspringNode: StructureOffspringTreeNode,
      targetName: string
    ): any {
      if (ancestorNode.structure.name === targetName) {
        return {
          ...ancestorNode,
          offspring: offspringNode.offspring || []
        };
      }
      return {
        ...ancestorNode,
        ancestors: ancestorNode.ancestors.map((a) =>
          mergeAncestryAndOffspring(a, offspringNode, targetName)
        ),
        offspring: [] // Only the target node gets offspring
      };
    }

    const mergedTree = mergeAncestryAndOffspring(
      ancestorTreeData,
      offspringTreeData,
      structure.name
    );

    // Render the merged tree
    function renderTree(node: any) {
      if (!node) return null;
      return (
        <ul>
          {node.ancestors && node.ancestors.map((ancestor: any, i: number) => (
            <li key={`ancestor-${i}`} className="ancestor">
              {renderTree(ancestor)}
            </li>
          ))}
          <li className="current">
            <strong>{node.structure.demangled_name || node.structure.name}</strong>
          </li>
          {node.offspring && node.offspring.map((child: any, i: number) => (
            <li key={`offspring-${i}`} className="offspring">
              {renderTree(child)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="inheritance-tree">
        {renderTree(mergedTree)}
      </div>
    );
  }

  function pseudocode(structure: Structure): string {
    const classOrStruct = getClassOrStruct(structure.name);
    const name = structure.demangled_name || structure.name;

    function getMemberType( member: Member ): string {
      if ( member.type === "struc" ) {
        return demangleMsvcClass(member.struc);
      } else if ( member.type === "vftptr" ) {
        return "void *";
      } else if ( member.type === "" ) {
        if ( member.size === 1 ) {
          return "int8";
        } else if ( member.size === 2 ) {
          return "int16";
        } else if ( member.size === 4 ) {
          return "int32";
        } else if ( member.size === 8 ) {
          return "int64";
        } else {
          return "unknown";
        }
      } else {
        return "unknown";
      }
    }

    // Parents (base classes)
    const parents = Array.from(structure.members.entries())
      .filter(([ , m ]) => m.parent && !m.base)
      .sort(([offsetA], [offsetB]) => Number(offsetA) - Number(offsetB))
      .map(([ , m ]) => demangleMsvcClass(m.struc))
      .join(", ");

    // Members
    const members = Array.from(structure.members.entries())
      .filter(([ , m ]) => !m.parent && !m.base && m.type !== "vftptr")
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([ , m ]) => `    ${getMemberType(m)} ${formatMemberName(m.name)};`)
      .join("\n");

    // Methods
    const methods = Array.from(structure.methods.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(m => `    ${m.name}();`)
      .join("\n");

    const membersSection = members ? `public:\n${members}\n` : '';
    const methodsSection = methods ? `public:\n${methods}\n` : '';
    return `${classOrStruct} ${name}${parents ? " : " + parents : ""} {\n${membersSection}${methodsSection}};`;
  }

  return (
    <section className="class-container">
      <h2>{ structure.demangled_name || name }</h2>
      { info() }
      <h3>Parents</h3>
      { parents() }
      <h3>Members</h3>
      { members() }
      <h3>Methods</h3>
      { methods() }
      <h3>VFTables</h3>
      { vtables() }
      <h3>Inheritance</h3>
      { inheritance() }
      <h3>Pseudocode</h3>
      <pre>
        <code>
          { pseudocode( structure ) }
        </code>
      </pre>
    </section>
  );
};
