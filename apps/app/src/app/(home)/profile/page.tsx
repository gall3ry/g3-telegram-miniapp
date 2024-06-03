"use client";
import { Button, Heading } from "@radix-ui/themes";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { useLogout } from "./useLogout";

const Page = () => {
  const { logout } = useLogout();

  return (
    <div>
      <Heading>Profile</Heading>

      <div className="mt-4">
        <Button color="red" onClick={logout} className="w-full" size="4">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
}
