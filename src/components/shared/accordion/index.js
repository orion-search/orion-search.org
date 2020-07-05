/** @jsx jsx */
import { useState } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useSpring, animated } from "react-spring";

import svgChevron from "../../../assets/img/chevron.svg";
import { Row, Column } from "../layout";
import { fadeIn } from "../../../utils";

const Wrapper = animated(Column);
const Content = animated(
  styled(Row)`
    padding-left: calc(20px + ${(props) => props.theme.spacing.small});
    margin: 0;
  `
);

export const Accordion = ({ title, content }) => {
  const [open, toggle] = useState(false);

  const Title = styled(title)`
    display: flex;
  `;
  const Icon = animated(styled("div")`
    width: 20px;
    height: 20px;

    margin-right: ${(props) => props.theme.spacing.small};

    background-position-x: center;
    background-position-y: center;
    background-repeat: no-repeat;
    background-image: url(${svgChevron});
    transform: rotate(90deg);
  `);

  const contentAnimation = useSpring({
    from: { opacity: open ? 0 : 1 },
    to: async (next, cancel) => {
      await next({ opacity: open ? 1 : 0 });
    },
    config: {
      ...fadeIn.config,
    },
  });

  const iconAnimation = useSpring({
    // from: { transform: open ? "rotate(0deg)" : "rotate(90deg)" },
    to: { transform: open ? "rotate(90deg)" : "rotate(0deg)" },
  });

  return (
    <Wrapper>
      <Row
        css={css`
          cursor: pointer;
        `}
        mv={"none"}
        onClick={() => toggle(!open)}
      >
        <Row
          css={css`
            justify-content: flex-start;
            align-items: center;
          `}
        >
          {/* {open ? "v" : ">"} */}
          <Icon style={iconAnimation} /> <Title />
        </Row>
      </Row>
      {open && (
        <Content style={contentAnimation} mv={"none"}>
          {content()}
        </Content>
      )}
    </Wrapper>
  );
};
