import styled from 'react-emotion';
import { Color } from './color';
import { size } from './sizes';
import { Text } from './text';

interface TextOverlayProps {
  active: boolean;
  children: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface StyledTextOverlayProps {
  active: boolean;
}

const StyledTextOverlay = styled(Text)`
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 30%;
    min-width: 100px;
    max-width: 350px;
    height: ${size.l}px;
    background-color: ${Color.VividRasberry};
  }
`;

export const TextOverlay = ({ active, children, onClick }: TextOverlayProps) => (
  <StyledTextOverlay active={ active } onClick={ onClick }>
    { children }
  </StyledTextOverlay>
);

export default TextOverlay;
