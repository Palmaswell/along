import propTypes from 'prop-types';
import styled from 'react-emotion';

import { breakpoints } from './breakpoints';
import { size } from './sizes';

const StyledMediaWrapper = styled.div`
  width: ${props => props.large
    ? 'auto'
    : `${size.s}px`
  };
  height: ${props => props.large
    ? 'calc(33vw - 25px)'
    : `${size.s}px`
  };
  border-radius: 10px;
  overflow: hidden;

  @media (min-width: ${breakpoints.m}) {
    width: ${props => props.large
      ? 'calc(33vw - 25px)'
      : `${size.l}px`
    };
    height: ${props => props.large
      ? 'calc(33vw - 25px)'
      : `${size.l}px`
    };
    max-width: 370px;
    max-height: 370px;
  }
  @media (min-width: ${breakpoints.l}) {
    width: ${props => props.large
      ? 'calc(33vw - 25px)'
      : `${size.xxl}px`
    };
    height: ${props => props.large
      ? 'calc(33vw - 25px)'
      : `${size.xxl}px`
    };
  }
`;

const StyledMedia = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%; /* Which is default ;) */
`

export const Media = ({ alt, large, src }) => (
  <StyledMediaWrapper large={large}>
    <StyledMedia alt={alt}  src={src} />
  </StyledMediaWrapper>
);

Media.propTypes =  {
  alt: propTypes.string.isRequired,
  src: propTypes.string.isRequired
}

export default Media;
