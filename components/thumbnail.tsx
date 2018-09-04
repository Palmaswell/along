import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import { size } from './sizes';
import Space from './space';

export interface ThumbnailProps {
  alt: string;
  caption: string;
  src: string;
}

const StyledFigure = styled.figure`
  display: flex;
  align-items: center;
  margin: 0;
`

const StyledImg = styled.img`
  width: ${size.s}px;
  height: ${size.s}px;
  border-radius: 50%;
  @media (min-width: ${ Breakpoint.M }) {
    width: ${size.l}px;
    height: ${size.l}px;
  }
`

export const Thumbnail: React.SFC<ThumbnailProps> = ({ alt, caption, src }): JSX.Element => (
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

export default Thumbnail;
