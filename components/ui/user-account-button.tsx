"use client";

import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import { useAuth } from "../providers/auth-provider";
import { ArrowRightFromSquare } from "@gravity-ui/icons";

const UserAvatar = (username: string) => {
  return (
    <Avatar size="sm" className="rounded-full">
      <Avatar.Image
        alt="Small Avatar"
        src={`https://api.dicebear.com/10.x/waves/svg?seed=${username}`}
      />
      <Avatar.Fallback>{username.charAt(0).toUpperCase()}</Avatar.Fallback>
    </Avatar>
  );
};

const UserAccountButton = () => {
  const { user, logout } = useAuth();

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        {/* <Button variant="ghost"> */}
        <div className="flex w-full items-center justify-between gap-2">
          {UserAvatar(user?.username || "Guest")}
          {user ? user.username : "Guest"}
        </div>
        {/* </Button> */}
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            {UserAvatar(user?.username || "Guest")}
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">
                {user ? user.username : "Guest"}
              </p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item id="profile" textValue="Profile">
            <Label>Profile</Label>
          </Dropdown.Item>
          <Dropdown.Item
            onAction={logout}
            id="logout"
            textValue="Logout"
            variant="danger"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Log Out</Label>
              <ArrowRightFromSquare className="size-3.5 text-danger" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default UserAccountButton;
