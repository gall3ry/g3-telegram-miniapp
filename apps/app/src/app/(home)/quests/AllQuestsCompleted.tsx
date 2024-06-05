"use client";

import { IconAllQuestsCompleted } from "./_icon/IconAllQuestsCompleted";

export const AllQuestsCompleted = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-44 w-[200px]">
        <IconAllQuestsCompleted />
      </div>

      <div className="text-center text-2xl font-bold leading-9 text-slate-900">
        You completed all the quests
      </div>

      <div className="mt-1 w-[335px] text-center text-base font-light leading-normal tracking-tight text-slate-500">
        More new quests coming soon! <br />
        Keep you head up.
      </div>
    </div>
  );
};
