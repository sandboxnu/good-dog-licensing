export function TableRowFormatting({
    key,
    isLast,
    children
}: {
    key: number;
    isLast: boolean;
    children: React.ReactNode;  
}) {
    return (
        <div
            key={key}
            className={`p-[16px] bg-white grid grid-cols-7 gap-4 border-[0.2px] border-t-0 border-solid border-cream-400 items-center ${isLast ? "rounded-b-[8px]" : ""}`}
            >
            {children}
            </div>
    )
}

export function TableHeaderFormatting({
    children
}: {
    children: React.ReactNode;  
}) {
    return (
  <div className="p-[16px] bg-cream-100 rounded-t-[8px] grid grid-cols-7 gap-4 border-[0.2px] border-solid border-cream-400 items-center">
            {children}
            </div>
    )
}


export function TableOuterFormatting({
    children
}: {
    children: React.ReactNode;  
}) {
    return (
         <div
      className="pt-[32px] pr-[24px] pl-[24px] pb-[48px] flex flex-col gap-[24px] self-stretch rounded-[24px] bg-gray-100 dark:bg-dark-gray-600 shadow-[0_2px_6px_0_#ECE6DF]
"
    >
      {children}
    </div>
    )
}

