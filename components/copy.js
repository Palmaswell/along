import styled from 'react-emotion';

import colors from './colors';
import { breakpoints } from './breakpoints';
import fontHind from './fonts';
import { size } from './sizes';
import { normalize } from 'path';

const StyledCopy = styled.span`
  font-size: ${props => {
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
  font-weight: ${props => props.weight
    ? props.weight
    : 'normal'
  };
  ${fontHind()};

  @media (min-width: ${ breakpoints.m } ) {
    font-size: ${props => {
    switch(props.size) {
      case 's':
        return '16px';
        break;
      default:
        return '18px';
    }
  }};
  }
`;

export const Copy = ({ children, color, size, tag, weight }) => {
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
