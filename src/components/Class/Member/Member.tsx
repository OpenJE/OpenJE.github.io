import './Member.css';

export type Member = {
  base: boolean,
  name: string,
  offset: string,
  parent: boolean,
  size: number,
  struc: string,
  type: string
  usages: Array<string>
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

export default function MemberData( offset: string, member: Member ) {
  return (
    <>
      <td>
        { offset }
      </td>
      <td>
        { formatMemberName(member.name) }
      </td>
      <td>
        {
          member.type === "vftptr"
            ? member.type
          : member.type === "struc"
            ? demangleMsvcClass( member.struc )
          : member.type
        }
      </td>
      <td>
        { `${member.size} (0x${member.size.toString(16).toUpperCase()})` }
      </td>
      <td>
        { member.parent ? 'Yes' : 'No' }
      </td>
      <td>
        { member.base ? 'Yes' : 'No' }
      </td>
    </>
  );
};
