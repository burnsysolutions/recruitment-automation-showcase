import { useParams } from "react-router-dom";
import { PlatformScreen } from "./PlatformView";

/** A screen on its own at full size, for making the thumbnails. Not linked from anywhere. */
export default function Shot() {
  const { slug = "" } = useParams();
  return (
    <div className="min-h-screen bg-[#e9edf2] p-10">
      <div id="shot" className="inline-block">
        <PlatformScreen slug={slug} />
      </div>
    </div>
  );
}
