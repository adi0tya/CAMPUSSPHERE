const Loader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
      </div>
      <p className="text-gray-600 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

export default Loader;
