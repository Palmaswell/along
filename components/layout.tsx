import styled from 'react-emotion';

const StyledLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;
export const Layout = ({ children }) => <StyledLayout>{ children }</StyledLayout>;
