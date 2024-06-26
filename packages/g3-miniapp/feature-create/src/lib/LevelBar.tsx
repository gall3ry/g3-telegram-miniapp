'use client';

export const LevelBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="h-[5px] bg-opacity-20 bg-white rounded-sm relative">
      <div
        className={`h-[5px] bg-green-400 rounded-tl-sm rounded-bl-sm absolute`}
        style={{
          width: `${percentage}%`,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  );
};
