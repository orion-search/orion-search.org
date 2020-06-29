import React, { useRef } from "react";
import { gql } from "apollo-boost";

import Paper, { PaperReducedDetail } from ".";

const data = {
  id: 2400828340,
  title:
    "living neural networks dynamic network analysis of developing neural progenitor cells",
  original_title:
    "Living Neural Networks: Dynamic Network Analysis of Developing Neural Progenitor Cells",
  source:
    "https://www.biorxiv.org/content/biorxiv/early/2017/08/25/055533.full.pdf",
  date: "2016-05-26",
  citations: 2,
  abstract:
    "Quantitative understanding of how neural progenitor cells (NPCs) collectively self-organize into neural networks can provide critical insight into how to optimize neural regenerative strategies. To that end, we characterized the topology of human embryonic NPCs during differentiation by designing and employing a spatial graph-theoretic analysis. Statistical measures of information flow in NPC spatial graphs revealed a shift from topologies with high global efficiency to high local efficiency, around the time mature neuronal phenotypes appeared in culture. These results support the view that network-wide signaling in immature progenitor cells gives way to a more structured, hierarchical form of communication in mature neural networks. We also demonstrate that the evaluation of recurring motif patterns in NPC graphs reveals unique geometric arrangements of cells in neural rosette-like structures at early stages of differentiation. Our approach provides insight into the design of developing neural networks, opening the door for new approaches that modulate neural cell self-organization for therapeutic applications.",
  authors: [
    {
      author: {
        name: "NE Grandel",
        __typename: "mag_authors",
      },
      __typename: "mag_paper_authors",
    },
    {
      author: {
        name: "KR Francis",
        __typename: "mag_authors",
      },
      __typename: "mag_paper_authors",
    },
    {
      author: {
        name: "AS Mahadevan",
        __typename: "mag_authors",
      },
      __typename: "mag_paper_authors",
    },
    {
      author: {
        name: "Jacob T. Robinson",
        __typename: "mag_authors",
      },
      __typename: "mag_paper_authors",
    },
    {
      author: {
        name: "Amina Ann Qutub",
        __typename: "mag_authors",
      },
      __typename: "mag_paper_authors",
    },
  ],
  publisher: "bioRxiv",
  year: "2016",
  topics: [
    {
      topic: {
        name: "Neural cell",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Artificial neural network",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Network topology",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Biology",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Dynamic network analysis",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Progenitor cell",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Bioinformatics",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Neural stem cell",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Systems biology",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
    {
      topic: {
        name: "Embryonic stem cell",
        __typename: "mag_fields_of_study",
      },
      __typename: "mag_paper_fields_of_study",
    },
  ],
  __typename: "mag_papers",
};

export default {
  title: "Design System/Molecules/Results",
  component: Paper,
  decorators: [],
};

export const Detail = () => {
  return <Paper data={data} />;
};

export const Compact = () => {
  return <PaperReducedDetail data={data} />;
};
