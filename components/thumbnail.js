import propTypes from 'prop-types';
import styled from 'react-emotion';

import { breakpoints } from './breakpoints';
import { size } from './sizes';
import Space from './space';

const StyledFigure = styled.figure`
  display: flex;
  align-items: center;
  margin: 0;
`

const StyledImg = styled.img`
  width: ${size.s}px;
  height: ${size.s}px;
  border-radius: 50%;
  @media (min-width: ${ breakpoints.m }) {
    width: ${size.xl}px;
    height: ${size.xl}px;
  }
`

export const Thumbnail = ({ alt, caption, src }) => (
  <StyledFigure>
    {caption &&
      <Space size={[0, size.xs, 0, 0]}>
        <figcaption>
          {caption}
        </figcaption>
      </Space>
    }
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
