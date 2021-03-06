import styled from 'react-emotion';

export interface GridItemProps {
  align?: string;
  justify?: string;
}

const StyledGridItem = styled.div`
  align-self: ${(props: GridItemProps) => props.align
  ? props.align
  : 'center'};
  justify-self: ${(props: GridItemProps) => props.justify
  ? props.justify
  : 'start'};
`


export const GridItem: React.SFC<GridItemProps> = ({ align, justify, children }): JSX.Element => (
  <StyledGridItem align={align} justify={justify}>
    { children }
  </StyledGridItem>
);

export default GridItem;
