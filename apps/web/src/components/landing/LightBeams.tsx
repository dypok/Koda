import React from 'react';

/** 3 haces cónicos de faro barriendo el hero. Solo puntero fino. */
export const LightBeams: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden [@media(pointer:fine)]:block">
    <div className="koda-beam-a absolute -top-10 left-[8%] h-[130%] w-40 bg-[linear-gradient(to_bottom,rgba(245,158,11,0.10),transparent_75%)] blur-2xl mix-blend-screen [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]" />
    <div className="koda-beam-b absolute -top-10 left-[45%] h-[130%] w-56 bg-[linear-gradient(to_bottom,rgba(251,191,36,0.08),transparent_75%)] blur-2xl mix-blend-screen [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)]" />
    <div className="koda-beam-a absolute -top-10 right-[6%] h-[130%] w-40 bg-[linear-gradient(to_bottom,rgba(249,115,22,0.09),transparent_75%)] blur-2xl mix-blend-screen [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)] [animation-duration:80s]" />
  </div>
);

export default LightBeams;
