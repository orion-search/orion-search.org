// eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { csv } from "d3";

import countryOutputData from "../../data/country_output.csv";
import fieldsOfStudyData from "../../data/field_of_study.csv";

import { AbsoluteCanvas } from "../renderer";
import Dropdown from "../dropdown";
import OutputNetworkLayoutManager from "./LayoutManager";
import { ParticleContainerForce } from "./ParticleContainerForce";

const HierarchicalViz = () => {
  const canvasRef = useRef(null);

  const [output, setOutput] = useState(null);
  const [fieldsOfStudy, setFieldsOfStudy] = useState(null);

  const [country, setCountry] = useState("United Kingdom");

  const [sizeVariable, setSizeVariable] = useState("total_citations");

  const viz = useRef(null);
  const layout = useRef(null);

  useLayoutEffect(() => {
    Promise.all([
      csv(countryOutputData, d => ({
        country: d.country,
        total_papers: +d.total_papers,
        total_citations: +d.total_citations,
        topic: d.topic,
        name: d.name
      })),
      csv(fieldsOfStudyData)
    ]).then(([output, fieldsOfStudy], error) => {
      setOutput(output);
      setFieldsOfStudy(fieldsOfStudy);
    });

    return function cleanup() {
      layout.current && layout.current.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!output || !fieldsOfStudy || !canvasRef.current) return;

    layout.current = new OutputNetworkLayoutManager({
      country,
      output,
      size: sizeVariable,
      topics: fieldsOfStudy
    });

    // viz.current = new FieldOfStudyParticles({
    //   // viz.current = new ParticleContainerForce({
    //   canvas: canvasRef.current,
    //   country,
    //   data: output,
    //   topics: fieldsOfStudy
    // });
    viz.current = new ParticleContainerForce({
      canvas: canvasRef.current,
      layout: layout.current
    });
  }, [output, fieldsOfStudy, canvasRef]);

  useEffect(() => {
    console.log("country changed", country);
    layout.current && layout.current.country(country);
  }, [country]);

  useEffect(() => {
    console.log("size variable changed");
    layout.current && layout.current.size(sizeVariable);
  }, [sizeVariable]);

  return (
    <>
      <div css={{ zIndex: -100 }}>
        <AbsoluteCanvas ref={canvasRef} />
      </div>
      {output && (
        <Dropdown
          selected={country}
          onChange={e => {
            setCountry(e.target.value);
          }}
          values={[...new Set(output.map(o => o.country))]}
        />
      )}
      <Dropdown
        selected={sizeVariable}
        onChange={e => {
          setSizeVariable(e.target.value);
        }}
        values={["total_papers", "total_citations"]}
      />
    </>
  );
};

export default HierarchicalViz;
