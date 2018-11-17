import styled from 'react-emotion';
import { CopySize } from './copy';
import { Color } from './color';
import getFontHind from './fonts';

interface TextProps {
  active: boolean;
  children: JSX.Element | string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface StyledTextProps {
  active: boolean;
}

const StyledText = styled.strong`
  cursor: pointer;
  color: ${Color.WhiteSmoke};
  font-size: ${CopySize.L}px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${getFontHind()}
  ${(props: StyledTextProps) => props.active};
`;

export const Text = ({active, className, children, onClick }: TextProps) => (
  <StyledText active={active} className={className} onClick={ onClick } tabIndex={0}>
    { children }
  </StyledText>
);
