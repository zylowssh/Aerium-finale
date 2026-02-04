import { Player } from "@remotion/player";
import { AeriumVideo, AERIUM_VIDEO_DURATION } from "@/remotion/AeriumVideo";
import { IntroductionScene } from "@/remotion/compositions/IntroductionScene";
import { ProblemScene } from "@/remotion/compositions/ProblemScene";
import { SolutionScene } from "@/remotion/compositions/SolutionScene";
import { ObjectiveScene } from "@/remotion/compositions/ObjectiveScene";
import { HowItWorksScene } from "@/remotion/compositions/HowItWorksScene";
import { FeaturesScene } from "@/remotion/compositions/FeaturesScene";
import { TechStackScene } from "@/remotion/compositions/TechStackScene";
import { UseCasesScene } from "@/remotion/compositions/UseCasesScene";
import { ConclusionScene } from "@/remotion/compositions/ConclusionScene";
import { useState, forwardRef } from "react";
import { useAudioGeneration } from "@/hooks/useAudioGeneration";
import { Volume2, Music, Loader2, Download, Copy, Check } from "lucide-react";

const compositions = [
  { id: "full", label: "Vidéo Complète", frames: AERIUM_VIDEO_DURATION, component: AeriumVideo },
  { id: "introduction", label: "Introduction", frames: 180, component: IntroductionScene },
  { id: "problem", label: "Le Problème", frames: 150, component: ProblemScene },
  { id: "solution", label: "La Solution", frames: 180, component: SolutionScene },
  { id: "objective", label: "Objectif", frames: 150, component: ObjectiveScene },
  { id: "how-it-works", label: "Fonctionnement", frames: 180, component: HowItWorksScene },
  { id: "features", label: "Fonctionnalités", frames: 150, component: FeaturesScene },
  { id: "tech-stack", label: "Technique", frames: 180, component: TechStackScene },
  { id: "use-cases", label: "Cas d'Usage", frames: 150, component: UseCasesScene },
  { id: "conclusion", label: "Conclusion", frames: 180, component: ConclusionScene },
];

const VideoSection = forwardRef<HTMLDivElement>((props, ref) => {
  const [activeScene, setActiveScene] = useState("full");
  const { 
    isGenerating, 
    progress, 
    audioAssets, 
    error, 
    generateAllNarration, 
    generateMusic,
    playAudio 
  } = useAudioGeneration();
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const currentComposition = compositions.find((c) => c.id === activeScene) || compositions[0];

  const handleGenerateVoice = async () => {
    try {
      await generateAllNarration();
    } catch (err) {
      console.error("Failed to generate narration:", err);
    }
  };

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    try {
      const url = await generateMusic(
        "Ambient electronic background music, inspirational technology documentary style, subtle synth pads, modern and clean, gentle build-up, 50 seconds",
        50
      );
      setMusicUrl(url);
    } catch (err) {
      console.error("Failed to generate music:", err);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handlePlaySceneAudio = (sceneId: string) => {
    const asset = audioAssets.find(a => a.sceneId === sceneId);
    if (asset) {
      playAudio(asset.audioUrl);
    }
  };

  const copyExportCommand = async (command: string) => {
    await navigator.clipboard.writeText(command);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const exportCommands = {
    full: "npx remotion render src/remotion/index.ts AeriumVideo out/aerium-video.mp4",
    scene: `npx remotion render src/remotion/index.ts ${activeScene} out/${activeScene}.mp4`,
  };

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Découvrez Aerium en Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualisez comment notre technologie surveille et analyse la qualité de l'air en temps réel.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={handleGenerateVoice}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération... {Math.round(progress)}%</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Générer Voix</span>
              </>
            )}
          </button>
          <button
            onClick={handleGenerateMusic}
            disabled={isGeneratingMusic}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {isGeneratingMusic ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération...</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4" />
                <span>Générer Musique</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
            <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-foreground mb-4">Exporter la vidéo en MP4</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Pour exporter votre vidéo, exécutez l'une des commandes suivantes dans votre terminal :
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Vidéo complète (50s)</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-secondary rounded-lg text-sm text-foreground font-mono overflow-x-auto">
                      {exportCommands.full}
                    </code>
                    <button
                      onClick={() => copyExportCommand(exportCommands.full)}
                      className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {copiedCommand ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {activeScene !== "full" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Scène actuelle ({currentComposition.label})</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-3 bg-secondary rounded-lg text-sm text-foreground font-mono overflow-x-auto">
                        {exportCommands.scene}
                      </code>
                      <button
                        onClick={() => copyExportCommand(exportCommands.scene)}
                        className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        {copiedCommand ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Prérequis :</strong> Assurez-vous d'avoir FFmpeg installé sur votre système. 
                  La vidéo sera exportée en 1920x1080 à 30fps.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm mb-6">
            {error}
          </div>
        )}

        {/* Audio status */}
        {(audioAssets.length > 0 || musicUrl) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 justify-center">
            {audioAssets.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                ✓ {audioAssets.length} narrations générées
              </span>
            )}
            {musicUrl && (
              <button
                onClick={() => playAudio(musicUrl)}
                className="px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                ▶ Jouer la musique
              </button>
            )}
          </div>
        )}

        {/* Scene selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {compositions.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setActiveScene(comp.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeScene === comp.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {comp.label}
              {audioAssets.find(a => a.sceneId === comp.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaySceneAudio(comp.id);
                  }}
                  className="ml-2 text-xs opacity-70 hover:opacity-100"
                  title="Jouer la narration"
                >
                  🔊
                </button>
              )}
            </button>
          ))}
        </div>

        {/* Video player */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
          <div className="aspect-video">
            <Player
              key={`${activeScene}-${musicUrl || 'no-music'}`}
              component={currentComposition.component}
              inputProps={activeScene === "full" ? { musicUrl } : {}}
              durationInFrames={currentComposition.frames}
              fps={30}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{
                width: "100%",
                height: "100%",
              }}
              controls
              loop
              autoPlay
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center space-y-2 mt-8">
          <p className="text-sm text-muted-foreground">
            {currentComposition.frames} frames @ 30fps = {(currentComposition.frames / 30).toFixed(1)}s
          </p>
          <p className="text-xs text-muted-foreground/60">
            Projet Aerium - Qualité de l'air IoT | Trophée NSI
          </p>
        </div>
      </div>
    </section>
  );
});

VideoSection.displayName = 'VideoSection';

export default VideoSection;
