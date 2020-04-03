import styled from "@emotion/styled";
import { Input } from "../../components/shared/search";

export default styled(Input)`
  font-size: ${props => `${props.theme.type.sizes.large}`};
  &::after {
    content: "⏎";
    position: absolute;
    left: 30px;
    color: white;
  }
`;
