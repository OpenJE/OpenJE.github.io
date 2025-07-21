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

export default function MemberData( offset: string, member: Member ) {
  return (
    <>
      <td>
        { offset }
      </td>
      <td>
        { member.name }
      </td>
      <td>
        { member.type }
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
