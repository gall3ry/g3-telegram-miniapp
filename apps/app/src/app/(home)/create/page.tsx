import { Avatar, Button } from "@radix-ui/themes";
import Link from "next/link";

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
      </div>
    </div>
  );
};

export const EpicItem = () => {
  return (
    <Link
      className="relative flex h-[132px] gap-4 rounded-xl bg-[#F8FFB7] p-4 transition hover:bg-opacity-70"
      href="#"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-[100px] w-[100px] rounded-lg"
        src="https://via.placeholder.com/100x100"
        alt="epic"
      />

      <div className="grow">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold leading-7 text-slate-900">GM!</div>

          <Button>Minted</Button>
        </div>

        <div className="mt-1.5">
          <div className="text-sm font-light leading-tight tracking-tight text-slate-500">
            Epic template description details goes here.
          </div>
        </div>

        <div className="mt-2.5">
          <div className="flex h-6 items-center gap-2">
            <div className="flex">
              {Array.from({ length: 3 }).map((_, i) => (
                <Avatar
                  className="-ml-2 first:ml-0"
                  key={i}
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  fallback="A"
                  size="1"
                />
              ))}
            </div>

            <div className="text-base font-medium leading-normal tracking-tight text-slate-900">
              {Intl.NumberFormat().format(4372)} minted
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Page;
