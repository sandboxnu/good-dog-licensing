interface InfoFieldProps {
  header: string;
  content: string;
}

export default function InfoField({ header, content }: InfoFieldProps) {
  return (
    <div className="flex flex-col">
      <header className="text-dark-gray-200 dark:text-dark-gray-100">
        {header}
      </header>
      <div className="text-dark-gray-600 dark:text-white">{content}</div>
    </div>
  );
}
