import styled from 'react-emotion';

const StyledList = styled.ul`
  display: inline-flex;
  flex-direction: column;
  padding-left: 0;
  margin: 0;
  list-style: none;
`;

export const SelectList: React.SFC<{}> = ({ children }) => (
  <StyledList>{ children }</StyledList>
);

export default SelectList;
