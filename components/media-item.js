import styled from 'react-emotion';

import colors from './colors';
import { size } from './sizes';

const StyledMediaItem = styled.div`
  align-self: ${props => props.align
  ? props.align
  : 'start'};
  justify-self: ${props => props.justify
  ? props.justify
  : 'start'};
`


const MediaItem = ({ align, justify, children }) => (
  <StyledMediaItem align={align} justify={justify}>
    { children }
  </StyledMediaItem>
);

export default MediaItem;
