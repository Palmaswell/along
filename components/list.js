import styled from 'react-emotion';

import { breakpoints } from './breakpoints';
import { size } from './sizes';

const StyledList = styled.ul`
  box-sizing: border-box;

  padding: 0 0 ${size.m}px;
  margin-top: 0;

  @media(min-width: ${breakpoints.m}){
    max-width: 2080px;
    margin: 0 auto;
  }
`


const StyledFlexList = styled(StyledList)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: ${size.xxs}px;
  justify-items: center;
  padding: ${size.xxs}px;

  @media(min-width: ${breakpoints.m}) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: scroll;
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
