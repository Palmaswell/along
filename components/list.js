import styled from 'react-emotion';

import { breakpoints } from './breakpoints';
import { size } from './sizes';

const StyledList = styled.ul`
  box-sizing: border-box;
  padding: 0 0 ${size.m}px;
  margin-top: 0;
`

const StyledFlexList = styled(StyledList)`
  display: flex;
  flex-wrap: wrap;

  @media(min-width: ${breakpoints.m}) {
    flex-direction: row;
    flex-wrap: nowrap;
  }
`;

export const List = ({ children, flex }) => (
  flex
    ?
    <StyledFlexList>
      { children }
    </StyledFlexList>
    :
    <StyledList>
      { children }
    </StyledList>
)

export default List;
