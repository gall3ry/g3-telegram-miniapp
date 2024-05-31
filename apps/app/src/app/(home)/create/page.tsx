import { Button } from "@radix-ui/themes";
import { Suspense } from "react";
import { MyOCC } from "../_components/MyOCC";
import { EpicItem } from "./EpicItem";

const Page = () => {
  return (
    <div>
      <div className="flex justify-center gap-2">
        <Button>Epic templates</Button>
        <Button color="gray" variant="outline">
          Created Epics
        </Button>
      </div>

      <div className="mt-4">
        <EpicItem />

        <Suspense>
          <MyOCC />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
