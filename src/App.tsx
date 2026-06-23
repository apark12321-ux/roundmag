import { roundImages, roundLogo } from "./roundAssets";

export default function App() {
  return (
    <div>
      <img src={roundLogo} alt="ROUNDMAG" />
      <img src={roundImages.round_jungwon} alt="cover" />
    </div>
  );
}
