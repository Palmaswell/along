import styled from 'react-emotion';
import { Transition } from 'react-transition-group';

import { Breakpoint } from './breakpoint';

export type TransitionStatusType = 'entering' | 'exiting' | 'entered' | 'exited';

export interface TransitionProps {
  isTransitioning: boolean;
}

interface StyledTransitionProps {
  transitionState: TransitionStatusType;
}

const StyledTransition = styled.div`
  opacity: 1;
  transition: transform ease;
  transition-duration: .333s;
  transform: translate3d(0, 0, 0);

  ${(props: StyledTransitionProps) => {
    switch(props.transitionState) {
      case 'entering':
      case 'exiting':
        return`
          transform: translate3d(0, 100vh, 0);
          @media (min-width: ${Breakpoint.M}) {
            transform: translate3d(-100vw, 0, 0);
          }
        `;
    }
  }}
`;

export const TransitionComponent: React.SFC<TransitionProps> = ({ children, isTransitioning }): JSX.Element => (
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

export default TransitionComponent;
