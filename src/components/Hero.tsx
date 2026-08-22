export function Hero() {
  return (
    <section className="board-texture relative overflow-hidden pt-16 pb-24 px-5">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-yellow/90 mb-4">
          Live listings · Updated by real students
        </span>
        <h1 className="font-sans font-bold text-4xl sm:text-5xl leading-[1.1] text-chalk">
          Every notice board in one place.
          <br />
          <span className="font-display text-marker text-5xl sm:text-6xl">
            No more full hostels.
          </span>
        </h1>
        <p className="mt-5 text-chalk/70 text-base sm:text-lg max-w-xl mx-auto">
          Search hostels and mess near your campus, see who&apos;s actually
          got space right now, and read reviews from students who&apos;ve
          lived there.
        </p>
      </div>
    </section>
  );
}
