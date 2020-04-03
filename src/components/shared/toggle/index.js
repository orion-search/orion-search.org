/**
 * @file a multimodal toggle component
 */

import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { useSprings, animated } from "react-spring";

// import { fadeIn, fadeOut } from "../../../utils";

const Wrapper = styled("div")`
  display: inline-block;
`;

const AnimatedOption = styled(animated.span)`
  cursor: pointer;
`;

const Toggle = ({ options, selected, onChange = () => {} }) => {
  const [active, setActive] = useState(selected);
  const springs = useSprings(
    options.length,
    options.map(option => ({
      opacity: option === active ? 1 : 0.35
    }))
  );

  const onToggleChange = option => {
    onChange(option);
    setActive(option);
  };

  return (
    <Wrapper>
      {springs.map((props, i) => (
        <Fragment key={`toggle-${options[i]}`}>
          <AnimatedOption
            style={props}
            onClick={() => onToggleChange(options[i])}
          >
            {`${options[i]} `}
          </AnimatedOption>
          {i < options.length - 1 ? "/ " : ""}
        </Fragment>
      ))}
    </Wrapper>
  );
};

Toggle.propTypes = {
  options: PropTypes.array
};

export default Toggle;
