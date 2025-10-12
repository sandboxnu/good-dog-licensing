const svgPattern = (sqSize: number) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${2 * sqSize}" height="${2 * sqSize}"><rect width="${sqSize}" height="${sqSize}" fill="#0D0039"/><rect x="${sqSize}" width="${sqSize}" height="${sqSize}" fill="#ACDD92"/><rect y="${sqSize}" width="${sqSize}" height="${sqSize}" fill="#ACDD92"/><rect x="${sqSize}" y="${sqSize}" width="${sqSize}" height="${sqSize}" fill="#0D0039"/></svg>`;
};

export default function CheckerColumn(
  props: Readonly<{
    squareSize?: number;
    numSquares: number;
    className?: string;
  }>,
) {
  const sqSize = props.squareSize ?? 20;
  const encodedPattern = `data:image/svg+xml;base64,${btoa(svgPattern(sqSize))}`;

  const style = {
    width: `${sqSize * props.numSquares}px`,
    backgroundImage: `url(${encodedPattern})`,
    backgroundRepeat: "repeat",
  };

  return <div style={style} className={props.className} />;
}
