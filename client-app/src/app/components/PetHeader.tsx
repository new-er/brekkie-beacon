const PetHeader = () => {
  const pets = ["🐱", "🐶", "🐹", "🐰"];

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-4 py-6 sm:py-8 px-4">
      <h2 className="w-full flex items-center justify-center gap-3 text-sm font-medium uppercase text-brand-muted mb-2">
        <span className="flex-1 h-px bg-brand-accent/30 max-w-[40px] sm:max-w-[60px]"></span>

        <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent font-bold tracking-[0.1em] xs:tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap px-1">
          Brekkie Beacon
        </span>

        <span className="flex-1 h-px bg-brand-accent/30 max-w-[40px] sm:max-w-[60px]"></span>
      </h2>

      {/* Pets Grid */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
        {pets.map((pet, index) => (
          <div
            key={index}
            suppressHydrationWarning={true}
            className="relative group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 text-2xl sm:text-3xl bg-brand-card/50 backdrop-blur-md border border-brand-accent/20 rounded-xl sm:rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:border-brand-primary hover:scale-110 hover:-translate-y-2 animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-brand-primary opacity-0 group-hover:animate-ping group-hover:opacity-20" />
            <div className="absolute inset-0 bg-brand-accent/5 rounded-xl sm:rounded-2xl blur-lg group-hover:bg-brand-primary/20 transition-colors" />
            <span className="relative z-10">{pet}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetHeader;
