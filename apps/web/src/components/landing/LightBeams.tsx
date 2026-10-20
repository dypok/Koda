import React from 'react';

/** 3 haces cónicos de faro en el hero (estáticos y sin mix-blend-screen para evitar sobrecarga de GPU). */
export const LightBeams: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden [@media(pointer:fine)]:block contain-strict">
    <div className="absolute -top-10 left-[8%] h-[115%] w-40 -rotate-6 bg-[linear-gradient(to_bottom,rgba(245,158,11,0.07),transparent_70%)] [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]" />
    <div className="absolute -top-10 left-[45%] h-[115%] w-56 rotate-3 bg-[linear-gradient(to_bottom,rgba(251,191,36,0.05),transparent_70%)] [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)]" />
    <div className="absolute -top-10 right-[6%] h-[115%] w-40 rotate-6 bg-[linear-gradient(to_bottom,rgba(249,115,22,0.06),transparent_70%)] [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]" />
  </div>
);

export default LightBeams;
