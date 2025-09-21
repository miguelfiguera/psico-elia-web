export default function Packages() {
  const packages = [
    {
      number: 1,
      title: 'Sesión individual',
      description: 'Ideal si quieres probar el espacio terapéutico o necesitas un acompañamiento puntual.',
      sessions: '1 sesión',
      price: '130.000 COP'
    },
    {
      number: 2,
      title: 'Bienestar mensual básico',
      description: 'Perfecto para quienes buscan un acompañamiento regular con seguimiento cada dos semanas.',
      sessions: '2 sesiones',
      price: '250.000 COP'
    },
    {
      number: 3,
      title: 'Acompañamiento intensivo',
      description: 'La mejor opción si quieres un proceso profundo, con seguimiento semanal y continuidad.',
      sessions: '4 sesiones',
      price: '350.000 COP'
    }
  ]

  return (
    <section id="paquetes" className="py-20 md:py-32 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl text-[var(--brown-dark)] mb-2 italic font-light">
          Conoce mis
        </h2>
        <h2 className="text-center text-5xl md:text-7xl lg:text-8xl text-[var(--brown-dark)] mb-16 italic font-light">
          Paquetes
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.number}
              className="bg-[var(--brown-medium)] rounded-3xl p-8 text-white flex flex-col h-full"
            >
              <div className="bg-white/20 rounded-2xl p-6 mb-6">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-center">
                  Paquete {pkg.number}:
                </h3>
                <h4 className="text-2xl md:text-3xl text-center">
                  {pkg.title}
                </h4>
              </div>

              <p className="text-lg mb-8 flex-grow text-center">
                {pkg.description}
              </p>

              <div className="text-center space-y-4">
                <p className="text-2xl italic">{pkg.sessions}</p>
                <p className="text-3xl md:text-4xl font-bold">{pkg.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}