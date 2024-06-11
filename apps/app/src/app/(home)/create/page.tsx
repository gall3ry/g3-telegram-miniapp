import { Spinner } from "@radix-ui/themes";
import { Suspense } from "react";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { MintOCC } from "./MintOcc";

const Page = () => {
  return (
    <div>
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
