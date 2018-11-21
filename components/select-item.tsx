import styled from 'react-emotion';
import { Color } from './color';
import { CopySize } from './copy';
import { size } from './sizes';
import getFontHind from './fonts';
import { Breakpoint } from './breakpoint';

interface SelectItem {
  active: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface StyledSelectItem {
  active: boolean;
}

const StyledListItem = styled.li`
  display: inline-flex;
  align-items: center;
  margin-bottom: ${size.xxs}px;
  transition: color 333ms ease;
  font-size: ${size.m}px;
  line-height: 1;
  color: ${(props: StyledSelectItem) => props.active
  ? Color.WhiteSmoke
  : Color.PaleAqua
  };
  text-transform: capitalize;
  cursor: pointer;
  ${getFontHind()}

  &:hover {
    color: ${Color.PaleChestNut};
  }

  @media (min-width: ${Breakpoint.M}) {
    font-size: ${size.xl}px;
  }
`;

const HintCopy = styled.small`
  font-size: ${CopySize.M}px;
`;

export const SelectItem: React.SFC<SelectItem> = ({ active, children, onClick }) => (
  <StyledListItem
    active={active}
    onClick={onClick}
    tabIndex={0}>
    { children }
    { active && <HintCopy>  (active)</HintCopy>}
  </StyledListItem>
);

export default SelectItem;
