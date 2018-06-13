import propTypes from 'prop-types';
import styled from 'react-emotion';
import { Transition } from 'react-transition-group';

import { breakpoints } from './breakpoints';

const StyledTransition = styled.div`
  opacity: 1;
  transition: transform ease;
  transition-duration: .333s;
  transform: translate3d(0, 0, 0);

  ${props => {
    switch(props.transitionState) {
      case 'entering':
      case 'exiting':
        return`
          transform: translate3d(0, 100vh, 0);
          @media (min-width: ${breakpoints.m}) {
            transform: translate3d(-100vw, 0, 0);
          }
        `;
    }
  }}
`;

export const TransitionComponent = ({ children, isTransitioning }) => (
  <Transition
    in={isTransitioning}
    timeout={0}>
    {status => (
      <StyledTransition
        transitionState={status}>
        {children}
      </StyledTransition>
    )}
  </Transition>
);

Transition.propTypes =  {
  isTransitioning: propTypes.bool
};

export default TransitionComponent;
