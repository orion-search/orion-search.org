/**
 * @file a multimodal toggle component
 */

import React, { useCallback, Fragment } from "react";
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

const Toggle = ({ values, selected, separator = "/", onChange = () => {} }) => {
  // const [active, setActive] = useState(selected);
  const springs = useSprings(
    values.length,
    values.map((option) => ({
      opacity: option === selected ? 1 : 0.35,
    }))
  );

  const onToggleChange = useCallback(
    (option) => {
      onChange(option);
      // setActive(option);
    },
    [onChange]
  );

  return (
    <Wrapper>
      {springs.map((props, i) => (
        <Fragment key={`toggle-${values[i]}`}>
          <AnimatedOption
            style={props}
            onClick={() => onToggleChange(values[i])}
          >
            {`${values[i]} `}
          </AnimatedOption>
          {i < values.length - 1 ? `${separator} ` : ""}
        </Fragment>
      ))}
    </Wrapper>
  );
};

Toggle.propTypes = {
  values: PropTypes.array,
};

export default Toggle;
