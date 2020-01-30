import Stats from "three/examples/jsm/libs/stats.module";
import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { csv } from "d3";

import countryOutputData from "../../data/country_output.csv";
import fieldsOfStudyData from "../../data/field_of_study.csv";

import { AbsoluteCanvas } from "../renderer";
import ParticleContainer, { FieldOfStudyParticles } from "./ParticleContainer";

const HierarchicalViz = () => {
  const canvasRef = useRef(null);
  const statsRef = useRef(null);

  const [output, setOutput] = useState(null);
  const [fieldsOfStudy, setFieldsOfStudy] = useState(null);

  const stats = new Stats();

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
    if (!canvasRef.current || !statsRef.current) return;

    statsRef.current.appendChild(stats.dom);
  }, [canvasRef, stats.dom]);

  useEffect(() => {
    if (!output || !fieldsOfStudy || !canvasRef.current || !statsRef.current)
      return;
    new FieldOfStudyParticles({
      canvas: canvasRef.current,
      stats,
      data: output,
      topics: fieldsOfStudy
    });
  }, [output, fieldsOfStudy, stats, canvasRef]);

  useLayoutEffect(() => {
    // new ParticleContainer({ canvas: canvasRef.current, stats });
  }, []);

  return (
    <>
      <div ref={statsRef} />
      <AbsoluteCanvas ref={canvasRef} />
    </>
  );
};

export default HierarchicalViz;
