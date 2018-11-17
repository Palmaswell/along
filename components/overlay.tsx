import styled, { css } from 'react-emotion';
import { Transition } from 'react-transition-group';
import { Color } from './color';
import { size } from './sizes';

interface OverlayProps {
  isOpen: boolean;
  timeout?: number;
}

interface StyledOverlayProps {
  transitionStatus: OverlayTransition;
}

enum OverlayTransition {
  entering = 'entering',
  exiting = 'exiting',
  entered = 'entered',
  exited = 'exited',
}

const createOverlayTransition = (status: OverlayTransition) => {
  switch(status) {
    case OverlayTransition.entering:
    case OverlayTransition.exited:
    return css`
        transform: translate3d(0, 0, 0);
      `;
    case OverlayTransition.entered:
    return css`
        transform: translate3d(-100vw, 0, 0);
      `;

    case OverlayTransition.exiting:
      return css`
        transform: translate3d(-200vw, 0, 0);
      `;

  }
};

const StyledOverlay = styled.section`
  flex: 0 0 calc(50vh - ${size.l}px);
  position: absolute;
  top: 0;
  left: 100vw;
  width: 100%;
  box-sizing: border-box;
  padding: ${size.xl}px ${size.xxs}px ${size.l}px;
  background-color: ${Color.UnitedNationsBlue};
  border-bottom: ${size.xxxs}px solid ${Color.PaleChestNut()};
  transform: translate3d(0, 0, 0);
  transition: 500ms cubic-bezier(1.000, 0.000, 0.000, 1.000);
  ${(props: StyledOverlayProps) => createOverlayTransition(props.transitionStatus)};
`;

export const Overlay: React.SFC<OverlayProps> = ({ isOpen, children, timeout = 0 }): JSX.Element | null => (
  <Transition
    in={isOpen}
    timeout={timeout}>
    {status => (
      <StyledOverlay transitionStatus={status}>
        { children }
      </StyledOverlay>
    )}
  </Transition>
);
