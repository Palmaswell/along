import styled from 'react-emotion';

import colors from './colors';
import { size } from './sizes';

const StyledGridItem = styled.div`
  align-self: ${props => props.align
  ? props.align
  : 'center'};
  justify-self: ${props => props.justify
  ? props.justify
  : 'start'};
`


const GridItem = ({ align, justify, children }) => (
  <StyledGridItem align={align} justify={justify}>
    { children }
  </StyledGridItem>
);

export default GridItem;
