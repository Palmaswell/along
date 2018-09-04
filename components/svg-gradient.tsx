export interface SVGGradientProps {
  id: string;
  startOffset: number;
  stopOffset: number;
  startColor: string;
  stopColor: string;
}


export function generateGradient({ id, startOffset, stopOffset, startColor, stopColor }: SVGGradientProps): JSX.Element {
  return (
    <linearGradient id={id}>
        <stop offset={`${startOffset}%`} stop-color={startColor} />
        <stop offset={`${stopOffset}%`} stop-color={stopColor} />
    </linearGradient>
  );
};

export default generateGradient;
