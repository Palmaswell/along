import styled from 'react-emotion';
import Color from './color';
import getFontHind from './fonts';

export type OrderType = 'h1' | 'h2'| 'h3';

export interface HeadlineProps {
  order: OrderType;
}

export interface StyledHeadlineProps {
  order: OrderType;
}

const StyledHeadline = styled.h1`
  margin: 0;
  font-size: ${(props: StyledHeadlineProps) => {
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
    font-size: ${(props: StyledHeadlineProps) => {
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
export const Headline: React.SFC<HeadlineProps> = ({ children, order }): JSX.Element => {
  const Component = StyledHeadline.withComponent(order);
  return (
    <Component order={order}>
        {children}
    </Component>
  )
}

export default Headline;
