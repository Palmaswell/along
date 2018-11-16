import styled from 'react-emotion';

import Color from './color';
import { Breakpoint } from './breakpoint';
import { size } from './sizes';
import { MouseEventHandler } from 'react';

export interface GridContainerProps {
  handleClick: MouseEventHandler<HTMLElement>;
  href?: string;
}

const StyledListContainer = styled.li`
  padding: ${size.xxs}px ${size.xxxs}px;
  list-style: none;
  background-color: ${Color.White()};

  :hover {
    background-color: ${Color.WhiteSmoke()};
  }

  @media (min-width: ${ Breakpoint.M }) {
    padding: ${size.xs}px ${size.xxs}px;
  }
  @media (min-width: ${ Breakpoint.L }) {
    padding: ${size.s}px ${size.xs}px;
  }
`;

const StyledGridContainer = styled.a`
  display: grid;
  grid-template-columns: 10px 52px calc(60vw - 62px) auto;
  grid-column-gap: ${size.xxxs}px;
  padding: 0 ${size.xxxs}px;
  text-decoration: none;
  cursor: pointer;

  @media (min-width: ${ Breakpoint.M }) {
    grid-template-columns: 20px 100px calc(60vw - 120px) auto;
    grid-column-gap: ${size.xxs}px;
    padding: 0 ${size.xxs}px;
  }
  @media (min-width: ${ Breakpoint.L }) {
    grid-template-columns: 20px 150px calc(60vw - 120px) auto;
  }
`;

export const GridContainer: React.SFC<GridContainerProps> = ({ children, handleClick, href }): JSX.Element => (
  <StyledListContainer>
    <StyledGridContainer
      onClick={handleClick}
      href={href}>
        { children }
    </StyledGridContainer>
  </StyledListContainer>
);


export default GridContainer;
