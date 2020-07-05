/** @jsx jsx */
import { jsx } from "@emotion/core";
import { compiler } from "markdown-to-jsx";
import React, { useState, useEffect } from "react";

import { Accordion } from "../../components/shared/accordion";

const data = [
  {
    url: require("../../assets/copy/faq.md"),
  },
];

const FAQPage = () => {
  const [questions, setQuestions] = useState([]);
  const accordions = [];

  questions.length &&
    console.log(React.Children.toArray(questions[0].props.children));
  if (questions.length) {
    const faqElements = React.Children.toArray(questions[0].props.children);

    for (let i = 0; i < faqElements.length; ) {
      const parent = faqElements[i];

      if (parent.type === `h3`) {
        const children = [];
        while (i + 1 < faqElements.length && faqElements[++i].type !== `h3`) {
          children.push(faqElements[i]);
        }
        accordions.push(
          React.createElement(Accordion, {
            title: () => parent,
            content: () => <div>{children}</div>,
            key: `accordion-${i}`,
          })
        );
      } else {
        break;
      }
    }
  }

  useEffect(() => {
    (async () => {
      Promise.all(data.map((d) => fetch(d.url)))
        .then((responses) => {
          return Promise.all(responses.map((d) => d.text()));
        })
        .then((d) => {
          setQuestions(d.map((_) => compiler(_)));
        });
    })();
  }, []);

  return <div>{accordions.map((a) => a)}</div>;
};

export default FAQPage;
