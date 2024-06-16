import { cn } from '@g3-miniapp/utils';
import { Button } from '@radix-ui/themes';
import { IconCheck } from '../_icons/IconCheck';

export const EffectItem = ({
  imageUrl,
  isDisabled,
  isSelected,
  disabledContent,
}: {
  imageUrl: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  disabledContent?: {
    title: string;
    buttonText: string;
    onClick: () => void;
  };
}) => {
  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden rounded-xl bg-black bg-cover'
      )}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      {isDisabled && disabledContent && (
        <>
          <div className="absolute inset-0 bg-black/40 blur-[2px]"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center text-base font-bold leading-normal text-white">
              {disabledContent.title}
            </div>
            <div className="mt-1">
              <Button
                className="inline-flex h-6 w-[57px]"
                onClick={disabledContent.onClick}
              >
                <div className="text-xs font-bold leading-[18px] text-slate-900">
                  {disabledContent.buttonText}
                </div>
              </Button>
            </div>
          </div>
        </>
      )}

      {isSelected && (
        <div className="absolute right-1 top-1 size-6">
          <IconCheck />
        </div>
      )}
    </div>
  );
};
