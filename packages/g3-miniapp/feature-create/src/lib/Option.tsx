'use client';
import { cn } from '@g3-miniapp/utils';

export const Option = ({
  onClick,
  icon,
  text,
  isActive,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  text: React.ReactNode;
  isActive?: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex h-14 items-center gap-3 rounded-lg bg-white p-4 ring-1 ring-slate-300',
        isActive ? 'bg-green-50 ring-2 ring-green-500' : ''
      )}
      onClick={onClick}
    >
      <div className="size-6">{icon}</div>

      <div className="text-xl font-bold leading-7 text-slate-900">{text}</div>

      <div className="flex-1"></div>

      {isActive ? (
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-green-200">
          <div className="h-3 w-3 rounded-full bg-green-600" />
        </div>
      ) : (
        <div className="h-6 w-6 rounded-full border-2 border-slate-300 bg-white" />
      )}
    </div>
  );
};
