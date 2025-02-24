import { UserType } from '@/types/types';
import { Table } from '@nextui-org/react';

interface FriendsTableProps {
  friends: UserType[] | null;
}

export default function FriendsTable({ friends }: FriendsTableProps) {
  return (
    <Table>
      <Table.Header>
        <Table.Column>Name</Table.Column>
      </Table.Header>
      <Table.Body>
        {friends ? (
          friends.map((friend) => (
            <Table.Row key={friend.id}>
              <Table.Cell>
                {friend.firstName} {friend.lastName}
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell>No Friends Yet!</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
