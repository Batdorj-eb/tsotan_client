const DEMO_YOUTUBE = "SdPM8t1h3kY";

function youtubeId(src?: string) {
  if (!src) return "";
  const match = src.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return match?.[1] || "";
}

export function VideoStory({ src }: { src?: string }) {
  const yt = youtubeId(src) || (!src ? DEMO_YOUTUBE : "");

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
      <div className="relative overflow-hidden bg-brand-dark">
        {yt ? (
          <iframe
            className="pointer-events-none h-52 w-full sm:h-64 lg:h-80"
            src={`https://www.youtube.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&playsinline=1&modestbranding=1&rel=0`}
            title="Tsotan video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={src}
            className="h-52 w-full object-cover sm:h-64 lg:h-80"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Tsotan video"
          />
        )}
      </div>
    </section>
  );
}
