import styled from 'react-emotion';

import Color from './color';
import { Breakpoint } from './breakpoint';
import getFontHind from './fonts';

export type CopyWeight = 'bold' | 'normal';

export type CopyTagTypes = 'p' | 'div' | 'span' | 'figcaption';

export enum CopySize {
  S = 14,
  M = 16,
  L = 18,
  XL = 24
}

export interface CopyProps {
  color?: string;
  size?: CopySize;
  tag: CopyTagTypes;
  weight?: CopyWeight;
}

const StyledCopy = styled.span`
  font-size: ${(props: CopyProps) => {
    switch(props.size) {
      case CopySize.S:
        return `${CopySize.S}px`;
      default:
        return `${CopySize.M}px`;
    }
  }};
  color: ${props => props.color
    ? props.color
    : Color.SmokyBlack()
  };
  text-decoration: none;
  font-weight: ${(props: CopyProps) => props.weight
    ? props.weight
    : 'normal'
  };
  ${getFontHind()};

  @media (min-width: ${ Breakpoint.M } ) {
    font-size: ${(props: CopyProps) => {
    switch(props.size) {
      case CopySize.S:
        return `${CopySize.S}px`;
      default:
        return `${CopySize.M}px`;
    }
  }};
  }
  @media (min-width: ${ Breakpoint.L } ) {
    font-size: ${(props: CopyProps) => {
    switch(props.size) {
      case CopySize.S:
        return `${CopySize.M}px`;
      default:
        return `${CopySize.L}px`;
    }
  }};
  }
`;

export const Copy: React.StatelessComponent<CopyProps> = ({ children, color, size, tag, weight }): JSX.Element => {
  const Component = StyledCopy.withComponent(tag);
  return (
    <Component
      color={color}
      tag={tag}
      size={size}
      weight={weight}>
      { children }
    </Component>
  )
};

export default Copy;
