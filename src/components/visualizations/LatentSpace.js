import React, { useRef, useEffect, useState } from "react";
import { ParticleContainerLatentSpace } from "../visualizations/ParticleContainerLatentSpace";
import { AbsoluteCanvas } from "../renderer";

const LatentSpace = ({ data }) => {
  const canvasRef = useRef(null);
  const particles = useRef(null);
  const layout = useRef({
    nodes: data.map(item => {
      return {
        x: item.vector_3d[0] * 100,
        y: item.vector_3d[1] * 100,
        z: item.vector_3d[2] * 100,
        title: item.title
      };
    })
  });

  useEffect(() => {
    particles.current = new ParticleContainerLatentSpace({
      canvas: canvasRef.current,
      layout: layout.current
    });
  }, [canvasRef]);
  return (
    <div css={{ zIndex: -100 }}>
      <AbsoluteCanvas ref={canvasRef} />
    </div>
  );
};

export default LatentSpace;
