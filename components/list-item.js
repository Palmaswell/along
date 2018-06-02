import styled from 'react-emotion';
import { size } from './sizes';
import { breakpoints } from './breakpoints';

const StyledListItem = styled.li`
  list-style: none;
  width: 100%;
`;

const StyledFlexListItem = styled(StyledListItem)`
  box-sizing: border-box;
  width: calc(100vw / 3);
  text-align: center;

  @media(min-width: ${breakpoints.m}) {
    min-width: calc(100vw / 2.5);
  }
`;

export const ListItem = ({ children, flex }) => (
  flex
    ?
    <StyledFlexListItem>
      { children }
    </StyledFlexListItem>
    :
    <StyledListItem>
      { children }
    </StyledListItem>
);

export default ListItem;
