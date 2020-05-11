import styled from "@emotion/styled";

export const Input = styled("input")`
  background: transparent;
  border: 2px solid ${(props) => props.theme.colors.white};
  display: flex;
  width: 100%;
  box-sizing: border-box;

  font-size: ${(props) => props.theme.type.sizes.small};

  color: ${(props) => props.theme.colors.white};
  outline-width: 0;
  border-width: 0 0 2px 0;
  padding: ${(props) => `calc(${props.theme.spacing.normal} / 2)`}
    ${(props) => props.theme.spacing.small}
    ${(props) => `calc(${props.theme.spacing.normal} / 2)`} 0;
`;

const TextArea = styled("textarea")`
  background: transparent;
  outline: none;
  border: none;
  border-width: 0 0 2px 0;
  border-bottom: 2px solid ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.white};
  resize: none;

  margin: ${(props) => `${props.theme.spacing.small}`} 0px !important;
`;

export default TextArea;
