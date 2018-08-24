import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import { size } from './sizes';

export interface ListProps {
  flex?: boolean;
}

const StyledList = styled.ul`
  box-sizing: border-box;

  padding: 0 0 ${size.m}px;
  margin-top: 0;

  @media(min-width: ${Breakpoint.M}){
    max-width: 2080px;
    margin: 0 auto;
  }
`

const StyledFlexList = styled(StyledList)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: ${size.xxs}px;
  justify-items: center;
  padding: 0 ${size.xxs}px;

  @media(min-width: ${Breakpoint.M}) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: scroll;
  }
`;

export const List: React.SFC<ListProps> = ({ children, flex }) => (
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
