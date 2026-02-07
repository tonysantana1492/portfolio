import { ImageZoom } from "./kibo-ui/image-zoom";

export function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative">
      <iframe
        className="aspect-video w-full rounded-xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </div>
  );
}

export function FramedImage({
  canZoom = true,
  ...props
}: React.ComponentProps<"img"> & {
  canZoom?: boolean;
}) {
  // biome-ignore lint/performance/noImgElement: <explanation >
  const image = <img alt="Embedded" {...props} />;

  return (
    <figure className="relative [&_img]:rounded-xl">
      {canZoom ? <ImageZoom>{image}</ImageZoom> : image}

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </figure>
  );
}
