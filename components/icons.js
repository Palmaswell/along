import styled from 'react-emotion';
import Color from './color';
import { Breakpoint } from './breakpoint';
import { size } from './sizes';

const StyledSVG = styled.svg`
  width: ${size.xxs}px;
  height: ${size.xxs}px;
  fill: ${Color.GunMetal()};
`

export const ArrowLeft = () => (
  <StyledSVG viewBox="0 0 129 129">
    <title>Go back svg icon</title>
    <path d="m88.6,121.3c0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2c1.6-1.6 1.6-4.2 0-5.8l-51-51 51-51c1.6-1.6 1.6-4.2 0-5.8s-4.2-1.6-5.8,0l-54,53.9c-1.6,1.6-1.6,4.2 0,5.8l54,53.9z"/>
  </StyledSVG>
  )

export default ArrowLeft;
