export default function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const textSize = size === "md" ? "text-base" : "text-sm";
  return (
    <span className={`inline-flex items-center gap-1 font-display ${textSize}`}>
      <span className="text-gold">★</span>
      <span className="font-medium text-zinc-900">{rating.toFixed(1)}</span>
    </span>
  );
}
