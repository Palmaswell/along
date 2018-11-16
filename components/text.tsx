import styled from 'react-emotion';
import { CopySize } from './copy';
import { Color } from './color';
import getFontHind from './fonts';

interface TextProps {
  children: JSX.Element | string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}


const StyledText = styled.strong`
  cursor: pointer;
  color: ${Color.WhiteSmoke};
  font-size: ${CopySize.L}px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${getFontHind()}
`;

export const Text = ({className, children, onClick }: TextProps) => (
  <StyledText className={className} onClick={ onClick } tabIndex={0}>
    { children }
  </StyledText>
);
