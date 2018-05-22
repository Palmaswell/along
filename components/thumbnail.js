import propTypes from 'prop-types';
import styled from 'react-emotion';
import { size } from './sizes';

const StyledFigure = styled.figure`
  display: flex;
  align-items: center;
  margin: 0;
`

const StyledImg = styled.img`
  width: ${size.s}px;
  height: ${size.s}px;
  border-radius: 50%;
  margin-left: ${size.xs}px;
`

export const Thumbnail = ({ alt, caption, src}) => (
  <StyledFigure>
    <figcaption>
      {caption}
    </figcaption>
    <StyledImg
    alt={alt}
    src={src} />
  </StyledFigure>
);

Thumbnail.propTypes =  {
  alt: propTypes.string.isRequired,
  caption: propTypes.string,
  src: propTypes.string.isRequired
}

export default Thumbnail;
