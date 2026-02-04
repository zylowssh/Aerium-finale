import { Sequence, AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { IntroductionScene } from "./compositions/IntroductionScene";
import { ProblemScene } from "./compositions/ProblemScene";
import { SolutionScene } from "./compositions/SolutionScene";
import { ObjectiveScene } from "./compositions/ObjectiveScene";
import { HowItWorksScene } from "./compositions/HowItWorksScene";
import { FeaturesScene } from "./compositions/FeaturesScene";
import { TechStackScene } from "./compositions/TechStackScene";
import { UseCasesScene } from "./compositions/UseCasesScene";
import { ConclusionScene } from "./compositions/ConclusionScene";
import { aeriumScript } from "./script";

// Total duration: 1500 frames = 50 seconds at 30fps
export const AERIUM_VIDEO_DURATION = 1500;

// Background music component with fade in/out
const BackgroundMusicLayer: React.FC<{ musicUrl?: string }> = ({ musicUrl }) => {
  const frame = useCurrentFrame();
  
  // Fade in over first 2 seconds (60 frames)
  const fadeIn = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // Fade out over last 3 seconds (90 frames)
  const fadeOut = interpolate(frame, [AERIUM_VIDEO_DURATION - 90, AERIUM_VIDEO_DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const volume = 0.25 * fadeIn * fadeOut;
  
  // If a music URL is provided (from generated music), use it
  if (musicUrl) {
    return <Audio src={musicUrl} volume={volume} />;
  }
  
  // Otherwise, try to use a static file if available
  // To add your own music: place an MP3 in public/music/background.mp3
  // and uncomment the line below:
  // return <Audio src={staticFile("music/background.mp3")} volume={volume} />;
  
  return null;
};

// Main video composition that combines all scenes following the Aerium script
export const AeriumVideo: React.FC<{ musicUrl?: string }> = ({ musicUrl }) => {
  let currentFrame = 0;

  const scenes = [
    { Component: IntroductionScene, frames: 180 },
    { Component: ProblemScene, frames: 150 },
    { Component: SolutionScene, frames: 180 },
    { Component: ObjectiveScene, frames: 150 },
    { Component: HowItWorksScene, frames: 180 },
    { Component: FeaturesScene, frames: 150 },
    { Component: TechStackScene, frames: 180 },
    { Component: UseCasesScene, frames: 150 },
    { Component: ConclusionScene, frames: 180 },
  ];

  return (
    <AbsoluteFill>
      {/* Background music layer */}
      <BackgroundMusicLayer musicUrl={musicUrl} />
      
      {/* Video scenes */}
      {scenes.map(({ Component, frames }, index) => {
        const from = currentFrame;
        currentFrame += frames;
        return (
          <Sequence key={index} from={from} durationInFrames={frames}>
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
