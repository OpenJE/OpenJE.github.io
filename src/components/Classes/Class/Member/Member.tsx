import './Member.css';

export type Member = {
  base: boolean,
  name: string,
  offset: string,
  parent: false,
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
        { member.size }
      </td>
    </>
  );
};
