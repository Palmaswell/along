import propTypes from 'prop-types';
import styled from 'react-emotion';

import { breakpoints } from './breakpoints';
import { size } from './sizes';

const StyledMedia = styled.img`
  width: ${size.s}px;
  height: ${size.s}px;
  border-radius: 10px;
  @media (min-width: ${ breakpoints.m }) {
    width: ${size.xl}px;
    height: ${size.xl}px;
  }
`

export const Media = ({ alt, src }) => <StyledMedia alt={alt} src={src} />;

Media.propTypes =  {
  alt: propTypes.string.isRequired,
  src: propTypes.string.isRequired
}

export default Media;
