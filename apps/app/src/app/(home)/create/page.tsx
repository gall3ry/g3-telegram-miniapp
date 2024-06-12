import { Button, Spinner } from "@radix-ui/themes";
import { Suspense } from "react";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { MintOCC } from "./MintOcc";

const Page = () => {
  return (
    <div>
      <div className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Button>GM</Button>
          <Button disabled>PNL</Button>
          <Button disabled>IDCard</Button>
        </div>
      </div>

      <MintOCC />
    </div>
  );
};

export default function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Suspense fallback={<Spinner mx="auto" />}>
        <Page />
      </Suspense>
    </LoggedUserOnly>
  );
}
