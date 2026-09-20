export interface VisualEffectProps {
  code: string;
  name: string;
  description: string;
  preset: string;
  animationSpeed: number;
  particleDensity: number;
  glowIntensity: number;
  defaultColor: string;
  dashStyle: string;
  isGpuAccelerated: boolean;
}

export class VisualEffectEntity {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly preset: string;
  readonly animationSpeed: number;
  readonly particleDensity: number;
  readonly glowIntensity: number;
  readonly defaultColor: string;
  readonly dashStyle: string;
  readonly isGpuAccelerated: boolean;

  constructor(props: VisualEffectProps) {
    this.code = props.code;
    this.name = props.name;
    this.description = props.description;
    this.preset = props.preset;
    this.animationSpeed = props.animationSpeed;
    this.particleDensity = props.particleDensity;
    this.glowIntensity = props.glowIntensity;
    this.defaultColor = props.defaultColor;
    this.dashStyle = props.dashStyle;
    this.isGpuAccelerated = props.isGpuAccelerated;
  }
}
