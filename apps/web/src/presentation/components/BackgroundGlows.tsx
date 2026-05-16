export function BackgroundGlows() {
  return (
    <>
      <div className="absolute top-10 left-10 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />
    </>
  );
}
