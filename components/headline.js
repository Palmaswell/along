import styled from 'react-emotion';

import Color from './color';
import getFontHind from './fonts';
const StyledHeadline = styled.h1`
  margin: 0;
  font-size: ${props => {
    switch(props.order) {
      case 'h1':
        return `48px`;
        break;
      case 'h2':
        return `36px`;
        break;
      case 'h3':
        return `28px`;
        break;
      default:
        return `20px`;
    }
    }
  };
  line-height: 1.5;
  color: ${Color.SmokyBlack()};
  text-align: center;
  ${getFontHind()}

  @media (min-width: 960px) {
    font-size: ${props => {
    switch(props.order) {
      case 'h1':
        return `76px`;
        break;
      case 'h2':
        return `60px`;
        break;
      case 'h3':
        return `48px`;
        break;
      default:
        return `36px`;
    }
    }
  };
  }
`;

export const Headline = ({ children, order }) => {
  const Component = StyledHeadline.withComponent(order);
  return (
    <Component order={order}>
        {children}
    </Component>
  )
}

export default Headline;
