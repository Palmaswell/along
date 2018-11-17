import styled from 'react-emotion';
import { Color } from './color';
import { CopySize } from './copy';
import { size } from './sizes';
import getFontHind from './fonts';
import { Breakpoint } from './breakpoint';

interface SelectItem {
  active: boolean;
}

interface StyledSelectItem {
  active: boolean;
}

const StyledListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: ${size.xxs}px;
  transition: color 333ms ease;
  font-size: ${size.m}px;
  line-height: 1;
  color: ${(props: StyledSelectItem) => props.active
  ? Color.WhiteSmoke
  : Color.PaleAqua
  };
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

export const SelectItem: React.SFC<SelectItem> = ({ active, children }) => (
  <StyledListItem active={active} tabIndex={0}>
    { children }
    { active && <HintCopy> (active)</HintCopy>}
  </StyledListItem>
);

export default SelectItem;
