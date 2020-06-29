/** @jsx jsx  */
import styled from "@emotion/styled";
import { jsx, css } from "@emotion/core";
import React, { forwardRef } from "react"; // eslint-disable-line no-unused-vars

import { Button } from "../button";

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

export const TextArea = styled("textarea")`
  display: flex;

  font-family: ${(props) => props.theme.type.fonts.regular};
  font-size: ${(props) => props.theme.type.sizes.large};
  color: ${(props) => props.theme.colors.white};

  background: transparent;
  outline: none;

  box-sizing: border-box;
  padding-left: 0%;

  box-sizing: content-box;
  border: none;
  border-width: 0 0 2px 0;
  border-bottom: 2px solid ${(props) => props.theme.colors.white};

  resize: none;

  width: 100%;
  max-height: 300px;
`;

export const SearchBar = forwardRef(
  ({ onClick = () => {}, autoResize = true, placeholder = `` }, ref) => {
    console.log(ref);
    const resize = (e) => {
      console.log(ref.current.scrollHeight);
      ref.current.style.height = 0;
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    };

    return (
      <div
        css={css`
          position: relative;
          display: flex;
          width: 100%;
          flex-direction: column;
          overflow: none;
        `}
      >
        <TextArea
          ref={ref}
          placeholder={placeholder}
          onInput={autoResize ? resize : () => {}}
          css={css`
            width: 90%;
          `}
        />
        <Button
          css={css`
            align-self: center;
            position: absolute;
            right: 0px;
            top: -18px;
            padding: 8px 8px;
          `}
          onClick={onClick}
        >
          Search
        </Button>
      </div>
    );
  }
);

// export default TextArea;
