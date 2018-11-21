import styled from 'react-emotion';
import { Color } from './color';
import { size } from './sizes';
import { Text } from './text';

interface TextOverlayProps {
  active: boolean;
  children: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface StyledTextProps {
  active: boolean;
}

const StyledTextOverlay = styled(Text)`
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    right: -${size.xxs}px;
    z-index: -1;
    width: 200%;
    min-width: 100px;
    max-width: 350px;
    height: ${size.l}px;
    margin: auto;
    background-color: ${Color.VividRasberry};
    transform: ${(props: StyledTextProps) => props.active
    ? `translate3d(0, 0, 0)`
    : `translate3d(105%, 0, 0)`
    };
    transition: 500ms cubic-bezier(1.000, 0.000, 0.000, 1.000);
  }
`;

export const TextOverlay = ({ active, children, onClick }: TextOverlayProps) => (
  <StyledTextOverlay active={ active } onClick={ onClick }>
    { children }
  </StyledTextOverlay>
);

export default TextOverlay;
