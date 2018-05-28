import propTypes from 'prop-types';
import styled from 'react-emotion';
import colors from './colors';

const StyledControls = styled.nav`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 65px;
  width: 100vw;
  background-color: ${colors.deepKoamaru()};
`;

const StyledSVG = styled.svg`
  align-self: center;
  width: 45px;
  height: 45px;
  fill: ${colors.lightCyan()};
  cursor: pointer;
`;

export const SpeechControl = ({ handleClick }) => {
  return (
    <StyledControls onClick={handleClick}>
      <StyledSVG viewBox="0 0 500 500">
        <title>Speech control button</title>
        <rect x="156.61" width="198.78" height="344.56" rx="99.39" ry="99.39"/><path d="M426.35,240.47a16.57,16.57,0,1,0-33.13,0c0,75.66-61.56,137.22-137.22,137.22S118.78,316.13,118.78,240.47a16.57,16.57,0,1,0-33.13,0c0,88.34,67.6,161.19,153.78,169.54v68.86H173.17a16.57,16.57,0,0,0,0,33.13H338.83a16.57,16.57,0,0,0,0-33.13H272.57V410C358.75,401.65,426.35,328.81,426.35,240.47Z"/>
      </StyledSVG>
    </StyledControls>
  )
};

SpeechControl.propTypes =  {
  handleClick: () => {}
}


export default SpeechControl;
