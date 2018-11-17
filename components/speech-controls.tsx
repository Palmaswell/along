import styled from 'react-emotion';
import Color from './color';

import { Breakpoint } from './breakpoint';
import { size } from './sizes'

export interface SpeechControlProps {
  handleClick: React.MouseEventHandler<HTMLElement>;
  isRecognizing: boolean;
}

interface StyledSVGProps {
  isRecognizing: boolean;
}

const StyledControls = styled.nav`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  padding: ${size.xxs}px 0;
  background-color: ${Color.WhiteSmoke()};
`;

const StyledSVG = styled.svg`
  align-self: center;
  width: 80px;
  fill: ${(props: StyledSVGProps) => props.isRecognizing
    ? Color.Amethyst()
    : Color.UnitedNationsBlue()
  };

  filter: ${(props: StyledSVGProps) => props.isRecognizing
    ? 'unset'
    : `drop-shadow(1px 1px 6px ${Color.LavenderGray()})`
  };
  cursor: pointer;
  transition: fill .333s ease;

  @media (min-width: ${Breakpoint.L}) {
    width: 100spx;
  }
`;

const StyledCircle = styled.circle`
  fill: ${Color.WhiteSmoke()};
`;

export const SpeechControl: React.SFC<SpeechControlProps> = ({ handleClick, isRecognizing }): JSX.Element => {
  return (
    <StyledControls onClick={handleClick}>
      <StyledSVG
        isRecognizing={isRecognizing}
        tabIndex={0}
        viewBox="0 0 50 50">
        <title>Voice control button</title>
        <desc>Press the button and speak out your command</desc>
        <StyledCircle
          cx="25.008"
          cy="24.991"
          r="24.489" />
          <path d="M25 .5C11.469.5.5 11.469.5 25S11.469 49.5 25 49.5 49.5 38.531 49.5 25 38.531.5 25 .5zm-6.794 13.794a6.794 6.794 0 0 1 13.588 0v9.965a6.794 6.794 0 0 1-13.588 0v-9.965zm7.927 21.233v4.708h4.53a1.134 1.134 0 0 1 0 2.265H19.338a1.134 1.134 0 0 1 0-2.265h4.53v-4.707c-5.891-.571-10.512-5.551-10.512-11.59v-.056a1.133 1.133 0 0 1 2.265.055c0 5.172 4.208 9.38 9.38 9.38s9.38-4.208 9.38-9.38v-.056a1.133 1.133 0 0 1 2.265.055c-.001 6.041-4.622 11.021-10.513 11.591z"/>
      </StyledSVG>
    </StyledControls>
  );
};


export default SpeechControl;
