import { User } from 'next-auth';
import { signOut } from 'next-auth/react';

import {
  Avatar,
  Dropdown,
  Link,
  Navbar,
  Text,
} from '@nextui-org/react';

interface AvatarDropDownProps {
	user: User;
}

const collapseItems = [
	"Profile",
	"Dashboard",
	"Activity",
	"My Settings",
	"Log Out",
];

const AvatarDropDown: React.FC<AvatarDropDownProps> = ({ user }) => {
	console.log(user);
	return (
		<>
			<Navbar.Content
				css={{
					"@xs": {
						w: "12%",
						jc: "flex-end",
					},
				}}
			>
				<Dropdown placement="bottom-right">
					<Navbar.Item>
						<Dropdown.Trigger>
							<Avatar
								bordered
								as="button"
								color="gradient"
								textColor="white"
								size="md"
								text={`${user.firstName[0]}${user.lastName[0]}`}
							/>
						</Dropdown.Trigger>
					</Navbar.Item>
					<Dropdown.Menu
						aria-label="User menu actions"
						color="secondary"
						onAction={(actionKey) => {
							if (actionKey === "logout") {
								signOut();
							}
						}}
					>
						<Dropdown.Item key="profile" css={{ height: "$18" }}>
							<Text b color="inherit" css={{ d: "flex" }}>
								{user.firstName} {user.lastName}
							</Text>
							<Text b color="inherit" css={{ d: "flex" }}>
								{user.email}
							</Text>
						</Dropdown.Item>
						<Dropdown.Item key="settings" withDivider>
							My Settings
						</Dropdown.Item>
						<Dropdown.Item key="logout" withDivider color="error">
							Log Out
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Navbar.Content>
			<Navbar.Collapse>
				{collapseItems.map((item, index) => (
					<Navbar.CollapseItem
						key={item}
						activeColor="secondary"
						css={{
							color: index === collapseItems.length - 1 ? "$error" : "",
						}}
						isActive={index === 2}
					>
						<Link
							color="inherit"
							css={{
								minWidth: "100%",
							}}
							href="#"
						>
							{item}
						</Link>
					</Navbar.CollapseItem>
				))}
			</Navbar.Collapse>
		</>
	);
};

export default AvatarDropDown;
