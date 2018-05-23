import styled from 'react-emotion';

import colors from './colors';
import fontHind from './fonts';
import { size } from './sizes';

const StyledCopy = styled.span`
  font-size: 16px;
  color: ${colors.lightCyan()};
  text-decoration: none;
  ${fontHind()};
`;

export const Copy = ({ children, tag }) => {
  const Component = StyledCopy.withComponent(tag);
  return (
    <Component tag={tag}>
      { children }
    </Component>
  )
};

export default Copy;
