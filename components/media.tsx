import styled from 'react-emotion';

import { Breakpoint } from './breakpoint';
import { size } from './sizes';

export interface MediaProps {
  alt: string;
  large?: boolean;
  src: string;
}

interface StyledMediaProps {
  large: boolean;
}

const StyledMediaWrapper = styled.div`
  width: ${(props: StyledMediaProps) => props.large
    ? 'auto'
    : `${size.s}px`
  };
  height: ${(props: StyledMediaProps) => props.large
    ? 'calc(33vw - 25px)'
    : `${size.s}px`
  };
  border-radius: 10px;
  overflow: hidden;

  @media (min-width: ${Breakpoint.M}) {
    width: ${(props: StyledMediaProps) => props.large
      ? 'calc(33vw - 25px)'
      : `${size.l}px`
    };
    height: ${(props: StyledMediaProps) => props.large
      ? 'calc(33vw - 25px)'
      : `${size.l}px`
    };
    max-width: 370px;
    max-height: 370px;
  }
  @media (min-width: ${Breakpoint.L}) {
    width: ${(props: StyledMediaProps) => props.large
      ? 'calc(33vw - 25px)'
      : `${size.xxl}px`
    };
    height: ${(props: StyledMediaProps) => props.large
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

export const Media: React.SFC<MediaProps> = ({ alt, large, src }) => (
  <StyledMediaWrapper large={large}>
    <StyledMedia alt={alt}  src={src} />
  </StyledMediaWrapper>
);

export default Media;
