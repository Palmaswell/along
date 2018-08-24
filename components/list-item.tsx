import styled from 'react-emotion';
import { size } from './sizes';
import { Breakpoint } from './breakpoint';

export interface ListItemProps {
  flex: boolean;
}

const StyledListItem = styled.li`
  list-style: none;
  width: 100%;
`;

const StyledFlexListItem = styled(StyledListItem)`
  box-sizing: border-box;
  text-align: center;
  margin-bottom: ${size.xs}px;

  @media(min-width: ${Breakpoint.M}) {
    width: calc(100vw / 3);
    max-width: 400px;
    margin-right: ${size.xs}px;
  }
`;

export const ListItem: React.SFC<ListItemProps> = ({ children, flex }): JSX.Element => (
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
