/** @jsx jsx */
import { useState } from "react";
import { css, jsx } from "@emotion/core";
import { useSpring, animated } from "react-spring";

import { Row, Column } from "../layout";
import { fadeIn } from "../../../utils";

const Wrapper = animated(Column);
const Content = animated(Row);

export const Accordion = ({ title, content }) => {
  const [open, toggle] = useState(false);

  const contentAnimation = useSpring({
    from: { opacity: open ? 0 : 1 },
    to: async (next, cancel) => {
      await next({ opacity: open ? 1 : 0 });
    },
    config: {
      ...fadeIn.config,
    },
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
        {title()}
      </Row>
      {open && (
        <Content style={contentAnimation} mv={"none"}>
          {content()}
        </Content>
      )}
    </Wrapper>
  );
};
