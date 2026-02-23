const PetHeader = () => {
  const pets = ["🐱", "🐶", "🐹", "🐰"];

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-4 py-8">
      <h2 className="text-sm font-medium tracking-[0.3em] uppercase text-brand-muted mb-2 flex items-center gap-3">
        <span className="w-8 h-px bg-brand-accent/30"></span>
        <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent font-bold">
          Brekkie Beacon
        </span>
        <span className="w-8 h-px bg-brand-accent/30"></span>
      </h2>

      <div className="flex justify-center gap-6">
        {pets.map((pet, index) => (
          <div 
            key={index}
            suppressHydrationWarning={true}
            className="relative group flex items-center justify-center w-16 h-16 text-3xl bg-brand-card/50 backdrop-blur-md border border-brand-accent/20 rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:border-brand-primary hover:scale-110 hover:-translate-y-2 animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute inset-0 rounded-2xl border-2 border-brand-primary opacity-0 group-hover:animate-ping group-hover:opacity-20" />
            
            <div className="absolute inset-0 bg-brand-accent/5 rounded-2xl blur-lg group-hover:bg-brand-primary/20 transition-colors" />
            <span className="relative z-10">{pet}</span>
          </div>
        ))}
      </div>
    </div>
  );};

export default PetHeader;
