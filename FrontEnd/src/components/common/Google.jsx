import styled from 'styled-components';

const GoogleButton = styled.button`
  user-select: none;
  -webkit-appearance: none;
  background-color: white;
  background-image: none;
  border: 1px solid #747775;
  border-radius: 30px;
  margin-top: 2px;
  box-sizing: border-box;
  color: #1f1f1f;
  cursor: pointer;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 14px;
  height: 52px;
  letter-spacing: 0.25px;
  outline: none;
  overflow: hidden;
  padding: 0 12px;
  position: relative;
  text-align: center;
  transition:
    background-color 0.218s,
    border-color 0.218s,
    box-shadow 0.218s;
  vertical-align: middle;
  white-space: nowrap;
  width: 527.99px;
  height: 50px;
  max-width: unset;
  min-width: unset;

  &:disabled {
    cursor: default;
    background-color: #ffffff61;
    border-color: #1f1f1f1f;

    ${'' /* 아래 컴포넌트들의 클래스명 기반 스타일 */}
    .gsi-material-button-contents,
    .gsi-material-button-icon {
      opacity: 0.38;
    }
  }

  &:not(:disabled):hover {
    box-shadow:
      0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 1px 3px 1px rgba(60, 64, 67, 0.15);
  }

  &:not(:disabled):hover .gsi-material-button-state {
    background-color: #303030;
    opacity: 0.08;
  }

  &:not(:disabled):active .gsi-material-button-state,
  &:not(:disabled):focus .gsi-material-button-state {
    background-color: #303030;
    opacity: 0.12;
  }
`;

const State = styled.div`
  transition: opacity 0.218s;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: space-between;
  position: relative;
  width: 100%;
`;

const IconWrapper = styled.div`
  height: 20px;
  width: 20px;
  min-width: 20px;
  margin-right: 12px;
`;

const Content = styled.span`
  flex-grow: 1;
  font-weight: 500;
  overflow: hidden;
  font-size: 20px;
  color: #3f3f3f;
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  /* display: flex; */
  text-overflow: ellipsis;
  vertical-align: top;
`;

export function GoogleSignInButton({ children = 'Google 계정으로 로그인', ...props }) {
  return (
    <GoogleButton {...props}>
      <State className="gsi-material-button-state" />
      <ContentWrapper>
        <IconWrapper className="gsi-material-button-icon">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ display: 'block' }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        </IconWrapper>
        <Content className="gsi-material-button-contents">{children}</Content>
        <span style={{ display: 'none' }}>{children}</span>
      </ContentWrapper>
    </GoogleButton>
  );
}
