interface InfoFieldProps {
  header: string;
  content: string;
}

export default function InfoField({ header, content }: InfoFieldProps) {
  return (
    <div className="flex flex-col">
      <header className="text-dark-gray-200 bg-dark-gray-500">{header}</header>
      <div>{content}</div>
    </div>
  );
}
