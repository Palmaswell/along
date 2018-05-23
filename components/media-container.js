import styled from 'react-emotion';

import colors from './colors';
import { size } from './sizes';

const StyledListContainer = styled.li`
  padding: ${size.xxxs}px 0;
  list-style: none;
  border-bottom: 1px solid ${colors.deepKoamaru()};
`;

const StyledMediaContainer = styled.a`
  display: grid;
  grid-template-columns: 10px 52px calc(60vw - 62px) auto;
  grid-column-gap: ${size.xxxs}px;
  text-decoration: none;
`;

const MediaContainer = ({ children, href, index }) => (
  <StyledListContainer>
    <StyledMediaContainer  href={href}>
        { children }
    </StyledMediaContainer>
  </StyledListContainer>
)

export default MediaContainer;
