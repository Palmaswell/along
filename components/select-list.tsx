import styled from 'react-emotion';

const StyledList = styled.ul`
  padding-left: 0;
  margin: 0;
  list-style: none;
`;

export const SelectList: React.SFC<{}> = ({ children }) => (
  <StyledList>{ children }</StyledList>
);

export default SelectList;
