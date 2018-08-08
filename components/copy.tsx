import styled from 'react-emotion';

import colors from './colors';
import { Breakpoint } from './breakpoint';
import fontHind from './fonts';

export type CopySize = 's' | 'm';
export type CopyWeight = 'bold' | 'normal';

export interface CopyProps {
  color?: string;
  size?: CopySize;
  tag: 'p' | 'div' | 'span';
  weight?: CopyWeight;
}

const StyledCopy = styled.span`
  font-size: ${(props: CopyProps) => {
    switch(props.size) {
      case 's':
        return '14px';
        break;
      default:
        return '16px';
    }
  }};
  color: ${props => props.color
    ? props.color
    : colors.smokyBlack()
  };
  text-decoration: none;
  font-weight: ${(props: CopyProps) => props.weight
    ? props.weight
    : 'normal'
  };
  ${fontHind()};

  @media (min-width: ${ Breakpoint.M } ) {
    font-size: ${(props: CopyProps) => {
    switch(props.size) {
      case 's':
        return '16px';
        break;
      default:
        return '18px';
    }
  }};
  }
  @media (min-width: ${ Breakpoint.L } ) {
    font-size: ${(props: CopyProps) => {
    switch(props.size) {
      case 's':
        return '18px';
        break;
      default:
        return '24px';
    }
  }};
  }
`;

export const Copy: React.StatelessComponent<CopyProps> = ({ children, color, size, tag, weight }) => {
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
