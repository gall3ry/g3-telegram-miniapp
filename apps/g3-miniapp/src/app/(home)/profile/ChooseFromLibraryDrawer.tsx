'use client';
import { cn } from '@g3-miniapp/utils';
import { BorderSolidIcon, PlusIcon } from '@radix-ui/react-icons';
import { Button, IconButton, Slider, Spinner } from '@radix-ui/themes';
import { useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Drawer as VauleDrawer } from 'vaul';
import {
  DrawerContent,
  DrawerFooter,
} from '../../../../../../packages/g3-miniapp/ui/src/lib/Drawer';
import styles from './ChooseFromLibraryDrawer.module.scss';
import { IconLeftArrow } from './_icon/IconLeftArrow';
import { IconX } from './_icon/IconX';
import { useEditQueryState } from './useEditQueryState';

export const ChooseFromLibraryDrawer = ({ photoFile }: { photoFile: File }) => {
  const { chooseFromLibrary, setChooseFromLibrary } = useEditQueryState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const image = useMemo(() => {
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  return (
    <VauleDrawer.NestedRoot
      open={chooseFromLibrary}
      onOpenChange={(open) => {
        void setChooseFromLibrary(open);
      }}
    >
      <DrawerContent className="h-fit">
        <div className="flex justify-between gap-4 px-5">
          <IconButton className="h-10 w-10 bg-slate-100 p-2" variant="soft">
            <IconLeftArrow />
          </IconButton>

          <div className="text-center text-2xl font-bold leading-9 text-slate-900">
            Adjust your picture
          </div>

          <IconButton className="h-10 w-10 bg-slate-100 p-2" variant="soft">
            <IconX />
          </IconButton>
        </div>

        <div className="px-5">
          <div className="relative mt-6 aspect-[335/440]">
            {!image ? (
              <Spinner />
            ) : (
              <Cropper
                image={image}
                classes={{
                  cropAreaClassName: 'rounded-2xl !border-4 !border-[#14DB60]',
                }}
                showGrid={false}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="my-8 flex items-center justify-between gap-5">
            <IconButton
              className="h-10 w-10 rounded-xl"
              onClick={() => {
                setZoom((prev) => Math.max(1, prev - 0.1));
              }}
              disabled={zoom <= 1}
            >
              <BorderSolidIcon color="white" />
            </IconButton>

            <div className={cn(styles.slider, 'flex-grow')}>
              <Slider
                min={1}
                max={3}
                step={0.1}
                defaultValue={[1]}
                onValueChange={([value]) => {
                  if (typeof value !== 'number') return;

                  setZoom(value);
                }}
                value={[zoom]}
                size="3"
              />
            </div>

            <IconButton
              className="h-10 w-10 rounded-xl"
              onClick={() => {
                setZoom((prev) => Math.min(3, prev + 0.1));
              }}
              disabled={zoom >= 3}
            >
              <PlusIcon color="white" />
            </IconButton>
          </div>
        </div>

        <DrawerFooter>
          <Button
            radius="large"
            size="4"
            onClick={async () => {
              await setChooseFromLibrary(false);
            }}
          >
            <div className="text-xl font-bold leading-7 text-slate-900">
              Save
            </div>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </VauleDrawer.NestedRoot>
  );
};
