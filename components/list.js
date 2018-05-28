import styled from 'react-emotion';
import { size } from './sizes';

const StyledList = styled.ul`
  box-sizing: border-box;
  padding: 0 ${size.xxs}px ${size.m}px;
  margin-top: 0;

  @media (min-width: 960px) {
    padding: 0 ${size.s}px ${size.l}px;
  };
`

export const List = ({ children }) => (
  <StyledList>
    { children }
  </StyledList>
)

export default List;
