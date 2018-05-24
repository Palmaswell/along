import propTypes from 'prop-types';
import styled from 'react-emotion';

import colors from './colors';
import { breakpoints } from './breakpoints';
import { size } from './sizes';

const StyledListContainer = styled.li`
  padding: ${size.xxxs}px 0;
  list-style: none;
  border-bottom: 1px solid ${colors.deepKoamaru()};

  @media (min-width: ${ breakpoints.m }) {
    padding: ${size.xs}px 0;
  }
`;

const StyledMediaContainer = styled.a`
  display: grid;
  grid-template-columns: 10px 52px calc(60vw - 62px) auto;
  grid-column-gap: ${size.xxxs}px;
  text-decoration: none;

  @media (min-width: ${ breakpoints.m }) {
    grid-template-columns: 20px 100px calc(60vw - 120px) auto;
    grid-column-gap: ${size.xxs}px;
  }
`;

const MediaContainer = ({ children, href }) => (
  <StyledListContainer>
    <StyledMediaContainer href={href}>
        { children }
    </StyledMediaContainer>
  </StyledListContainer>
);

MediaContainer.propTypes =  {
  href: propTypes.string.isRequired
}


export default MediaContainer;
