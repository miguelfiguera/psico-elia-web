import Image from 'next/image'

export default function About() {
  return (
    <section id="sobre-mi" className="py-20 md:py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Mission Statement */}
        <div className="text-center mb-20 bg-[var(--brown-medium)] text-white rounded-[40px] py-12 px-8 md:px-16 max-w-5xl mx-auto">
          <p className="text-xl md:text-2xl leading-relaxed">
            Mi misión es acompañarte a construir una vida más estable
            y consciente, en un espacio donde puedas sentir
            confianza y ser escuchado sin juicios.
          </p>
        </div>

        {/* About Me Section */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-5xl md:text-6xl lg:text-7xl mb-8 text-[var(--brown-dark)] italic font-light text-center">
              Sobre mí
            </h2>

            <h3 className="text-xl md:text-2xl mb-6 text-[var(--brown-dark)] text-center">
              Soy Elia, psicóloga clínica y máster en
              neuropsicología. Acompañaré tu proceso con
              una taza de café y un espacio seguro
            </h3>

            <div className="space-y-4 text-[var(--text-light)] text-center">
              <p>
                Desde pequeña sentí una gran curiosidad por
                comprender a las personas y escuchar
                incluso lo que no se dice con palabras. Con el
                tiempo descubrí que mi vocación estaba en
                acompañar a otros a encontrar claridad y
                sentido en su vida, lo que me llevó a estudiar
                Psicología y especializarme en el ámbito
                clínico.
              </p>

              <p>
                Compartir reflexiones y acompañar procesos
                se ha convertido en un puente que me
                confirma cada día que elegí el camino
                correcto. Hoy sigo formándome, agradecida
                por este viaje que comparto con colegas,
                pacientes y todas las personas que confían
                en mí. Y lo mejor, es que apenas estamos
                comenzando.
              </p>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden order-first md:order-last">
            <Image
              src="/psicoEliaPortrait.jpg"
              alt="Elia - Psicóloga"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}