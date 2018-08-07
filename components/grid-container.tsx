import styled from 'react-emotion';

import colors from './colors';
import { breakpoints } from './breakpoints';
import { size } from './sizes';
import { MouseEventHandler } from '../node_modules/@types/react';

export interface GridContainerProps {
  handleClick: MouseEventHandler<HTMLElement>;
  href?: string;
}

const StyledListContainer = styled.li`
  padding: ${size.xxxs}px;
  list-style: none;
  background-color: ${colors.white()};

  :hover {
    background-color: ${colors.whiteSmoke()};
  }

  @media (min-width: ${ breakpoints.m }) {
    padding: ${size.xs}px;
  }
`;

const StyledGridContainer = styled.a`
  display: grid;
  grid-template-columns: 10px 52px calc(60vw - 62px) auto;
  grid-column-gap: ${size.xxxs}px;
  padding: 0 ${size.xxxs}px;
  text-decoration: none;
  cursor: pointer;

  @media (min-width: ${ breakpoints.m }) {
    grid-template-columns: 20px 100px calc(60vw - 120px) auto;
    grid-column-gap: ${size.xxs}px;
    padding: 0 ${size.xxs}px;
  }
  @media (min-width: ${ breakpoints.l }) {
    grid-template-columns: 20px 150px calc(60vw - 120px) auto;
  }
`;

const GridContainer: React.SFC<GridContainerProps> = ({ children, handleClick, href }) => (
  <StyledListContainer>
    <StyledGridContainer
      onClick={handleClick}
      href={href}>
        { children }
    </StyledGridContainer>
  </StyledListContainer>
);


export default GridContainer;
