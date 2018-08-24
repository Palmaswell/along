import propTypes from 'prop-types';
import styled, { keyframes } from 'react-emotion';
import { Transition } from 'react-transition-group';

import { Breakpoint } from './breakpoint';
import { Copy } from './copy'
import { Color } from './color';

const PULSE = keyframes`
  from, to {
    transform: scale3d(1, 1, 1);
  }
  25%, 75% {
    transform: scale3d(.8, .8, .8);
  }
`;

const StyledLayer = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${Color.UnitedNationsBlue()};
  transition: opacity .666s ease;

  ${props => {
    switch(props.transitionState) {
      case 'entering':
      case 'exiting':
        return`
          opacity: 0;
        `;
      case 'exited':
      case 'entered':
        return`
          opacity: 1;
        `;
    }
  }}
`
const StyledFigure = styled.figure`
  align-self: center;
  text-align: center;
`
const StyledSvg = styled.svg`
  width: 200px;
  fill: ${Color.WhiteSmoke()};
  animation: ${PULSE} .666s ease infinite;

  @media (min-width: ${Breakpoint.L}) {
    width: 250px;
  }

  ${props => {
    switch(props.transitionState) {
      case 'entering':
      case 'entered':
        return`
          animation-play-state: running;
        `;
      case 'exited':
        return`
          animation-play-state: paused;
        `;
    }
  }}
`;

export const Loading = ({ isTransitioning }) => {
  return(
  <Transition
    in={isTransitioning}
    timeout={1000}>
    {status => (
      <StyledLayer transitionState={status}>
        <StyledFigure>
          <StyledSvg
            transitionState={status}
            viewBox="0 0 100 100">
            <path d="M73.12 69.12l7.21 6.96c-4.71 6.18-15.19 12.229-22.9 13.22L55 79.58c6.18-.67 14.45-5.439 18.12-10.46zM55 79.58v10.109c-8.99 1.67-22.23-1.869-29.17-7.819a39.854 39.854 0 0 1-7.7-7.7l10.58-3.029c3.4 3.84 10.65 7.689 15.74 8.34l1.2.859-.65-1.311V59.98l.75-2.621-1.89 1.961-25.73 14.85c-10.59-13.93-11.09-33.72 0-48.34C27.08 14.029 41.3 8.59 55 10.311V79.58zM45 20.971l.65-1.311-1.2.859c-16.28 3.061-27 18.75-23.931 35.029.189 1.15.761 3.29 1.171 4.381l-.15 1.471.82-1.211L45 47.109V20.971z"/>
            <path d="M74.17 18.13c17.6 13.351 21.05 38.44 7.7 56.04l-8.75-5.05-14.75-8.511-3.37-13.5 22.64 13.08.82 1.211-.15-1.471c5.48-15.631-2.738-32.75-18.368-38.24-.57-.199-1.69-.551-2.271-.689L55 10.311c6.75.839 13.36 3.419 19.17 7.819z"/>
          </StyledSvg>
          <Copy
            color={Color.WhiteSmoke()}
            tag="figcaption">
            ...waiting for WebSockets client
          </Copy>
        </StyledFigure>
    </StyledLayer>
    )}
  </Transition>
)}

Loading.propTypes =  {
  isTransitioning: propTypes.bool
};
export default Loading;
