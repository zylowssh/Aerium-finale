import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface SceneTransitionProps {
  durationInFrames: number;
  type?: "fade" | "wipe" | "zoom";
  direction?: "in" | "out";
  color?: string;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  durationInFrames,
  type = "fade",
  direction = "in",
  color = "hsl(220, 30%, 5%)",
}) => {
  const frame = useCurrentFrame();
  
  const fadeFrames = Math.min(15, durationInFrames / 4);
  const startFade = direction === "in" ? 0 : durationInFrames - fadeFrames;
  const endFade = direction === "in" ? fadeFrames : durationInFrames;

  if (type === "fade") {
    const opacity = interpolate(
      frame,
      [startFade, endFade],
      direction === "in" ? [1, 0] : [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: color,
          opacity,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === "wipe") {
    const progress = interpolate(
      frame,
      [startFade, endFade],
      direction === "in" ? [100, 0] : [0, 100],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${color} ${progress}%, transparent ${progress + 20}%)`,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === "zoom") {
    const scale = interpolate(
      frame,
      [startFade, endFade],
      direction === "in" ? [1.2, 1] : [1, 1.2],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const opacity = interpolate(
      frame,
      [startFade, endFade],
      direction === "in" ? [1, 0] : [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: color,
          opacity,
          transform: `scale(${scale})`,
          pointerEvents: "none",
        }}
      />
    );
  }

  return null;
};
