import propTypes from 'prop-types';
import styled from 'react-emotion';
import colors from './colors';

import { breakpoints } from './breakpoints';
import { size } from './sizes'

const StyledControls = styled.nav`
  position: fixed;
  bottom: ${size.m}px;;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
`;

const StyledSVG = styled.svg`
  align-self: center;
  width: 60px;
  fill: ${colors.unitedNationsBlue()};
  cursor: pointer;
  transition: fill .666s ease;

  :hover {
    fill: ${colors.paleChestNut()};
  }

  @media (min-width: ${breakpoints.l}) {
    width: 100px;
  }
`;

export const SpeechControl = ({ handleClick }) => {
  return (
    <StyledControls onClick={handleClick}>
      <StyledSVG viewBox="0 0 50 50">
        <title>Speech control button</title>
        <path d="M25 .5C11.469.5.5 11.469.5 25S11.469 49.5 25 49.5 49.5 38.531 49.5 25 38.531.5 25 .5zm-6.794 13.794a6.794 6.794 0 0 1 13.588 0v9.965a6.794 6.794 0 0 1-13.588 0v-9.965zm7.927 21.233v4.708h4.53a1.133 1.133 0 0 1 0 2.265H19.338a1.133 1.133 0 0 1 0-2.265h4.53v-4.707c-5.891-.571-10.512-5.551-10.512-11.59v-.056a1.133 1.133 0 0 1 2.265.055c0 5.172 4.208 9.38 9.38 9.38s9.38-4.208 9.38-9.38v-.056a1.133 1.133 0 0 1 2.265.055c-.001 6.041-4.622 11.021-10.513 11.591z"/>
      </StyledSVG>
    </StyledControls>
  )
};

SpeechControl.propTypes =  {
  handleClick: () => {}
}


export default SpeechControl;
