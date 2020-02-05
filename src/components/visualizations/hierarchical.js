// eslint-disable-line import/no-webpack-loader-syntax
import Stats from "three/examples/jsm/libs/stats.module";
import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { csv } from "d3";

import countryOutputData from "../../data/country_output.csv";
import fieldsOfStudyData from "../../data/field_of_study.csv";

import { AbsoluteCanvas } from "../renderer";
import Dropdown from "../dropdown";
import { FieldOfStudyParticles } from "./ParticleContainer";
import OutputNetworkLayoutManager from "./LayoutManager";
import { ParticleContainerForce } from "./ParticleContainerForce";
// import { ParticleContainerForce } from "./ParticleContainerForce";

const HierarchicalViz = () => {
  const canvasRef = useRef(null);
  const statsRef = useRef(null);

  const [output, setOutput] = useState(null);
  const [fieldsOfStudy, setFieldsOfStudy] = useState(null);

  const [country, setCountry] = useState("United Kingdom");

  const stats = new Stats();

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
  }, []);

  useEffect(() => {
    if (!output || !fieldsOfStudy || !canvasRef.current) return;
    statsRef.current.appendChild(stats.dom);

    layout.current = new OutputNetworkLayoutManager({
      output,
      stats,
      topics: fieldsOfStudy
    });

    // viz.current = new FieldOfStudyParticles({
    //   // viz.current = new ParticleContainerForce({
    //   canvas: canvasRef.current,
    //   country,
    //   data: output,
    //   stats,
    //   topics: fieldsOfStudy
    // });
    viz.current = new ParticleContainerForce({
      canvas: canvasRef.current,
      layout: layout.current
    });
  }, [output, fieldsOfStudy, canvasRef]);

  useEffect(() => {
    console.log("country changed", country);
    viz.current && viz.current.updateCountry(country);
  }, [country]);

  return (
    <>
      <div css={{ zIndex: -100 }}>
        <div ref={statsRef} />
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
    </>
  );
};

export default HierarchicalViz;
