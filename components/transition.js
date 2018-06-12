import propTypes from 'prop-types';
import styled from 'react-emotion';
import { Transition } from 'react-transition-group';

const StyledTransition = styled.div`
  opacity: 1;
  transition: opacity ease-in-out;
  transition-duration: .5s;

  ${props => {
    switch(props.transitionState) {
      case 'entering':
      case 'exiting':
        return`
          opacity: 0;
        `;
    }
  }}
`;

export const TransitionComponent = ({ children, isTransitioning }) => (
  <Transition
    in={isTransitioning}
    mountOnEnter={true}
    unmountOnExit={true}
    timeout={{
      enter: 500,
      exit: 500,
    }}>
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
