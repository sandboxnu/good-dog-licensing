export default function CommentText({ text }: { text: string }) {
  const URL_REGEX = /https?:\/\/[^\s]+/g;
  const parts: { text: string; isLink: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isLink: false });
    }
    parts.push({ text: match[0], isLink: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isLink: false });
  }

  return (
    <p className="text-sm text-dark-gray-400 dark:text-gray-200 break-words">
      {parts.map((part, i) =>
        part.isLink ? (
          <a
            key={i}
            href={part.text}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 text-green-500 dark:text-mint-300"
          >
            {part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}
