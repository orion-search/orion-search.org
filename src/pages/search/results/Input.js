import styled from "@emotion/styled";
import Input from "../../../components/shared/input";

export default styled(Input)`
  font-size: ${(props) => `${props.theme.type.sizes.large}`};
  margin: ${(props) =>
    `${props.theme.spacing.huge} 0 ${props.theme.spacing.small} 0`};
  &::after {
    content: "⏎";
    position: absolute;
    left: 30px;
    color: white;
  }
`;
