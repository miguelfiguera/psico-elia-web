import Image from 'next/image'
import { Coffee, Users, Heart, Frown, Brain } from 'lucide-react'

const services = [
  {
    title: 'Terapia Individual',
    subtitle: '(Jóvenes y adultos)',
    description: 'Un espacio para entenderte mejor, transformar tus patrones emocionales y crecer a tu propio ritmo.',
    icon: 'coffee',
    bgColor: 'bg-[var(--brown-medium)]'
  },
  {
    title: 'Terapia para Adolescentes',
    subtitle: '(13-18 años)',
    description: 'Un espacio seguro y sin juicios para que exploren sus emociones, identidad y relaciones, con acompañamiento cercano.',
    icon: 'bean',
    bgColor: 'bg-[var(--brown-light)]'
  },
  {
    title: 'Terapia para Parejas',
    subtitle: '',
    description: 'Un espacio para reconstruir, transformar o decidir sobre la relación.',
    icon: 'double-bean',
    bgColor: 'bg-[var(--brown-medium)]'
  }
]

const conditions = [
  {
    title: 'Ansiedad',
    description: 'Herramientas para recuperar la calma y vivir con mayor equilibrio.',
    icon: Users,
    bgColor: 'bg-[var(--brown-medium)]'
  },
  {
    title: 'Depresión',
    description: 'Acompañamiento para recuperar la motivación y el disfrute por la vida.',
    icon: Frown,
    bgColor: 'bg-[var(--brown-light)]'
  },
  {
    title: 'Autoestima',
    description: 'Construye una relación más sana contigo mismo, basada en autocompasión y confianza.',
    icon: Heart,
    bgColor: 'bg-[var(--brown-medium)]'
  }
]

export default function Services() {
  return (
    <section id="servicios" className="py-20 md:py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--brown-dark)] mb-4 italic font-light leading-tight">
            Mi misión es acompañarte a construir una vida más estable y consciente.
          </h2>
          <p className="text-2xl md:text-3xl text-[var(--pink-accent)] italic">
            Tómate un coffee break conmigo y hablemos de lo que necesitas.
          </p>
        </div>

        {/* Service Types */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.bgColor} text-white rounded-2xl p-8 h-full flex flex-col`}
            >
              <div className="mb-6 flex justify-center">
                {service.icon === 'coffee' && (
                  <Image src="/icons/coffecup.png" alt="Coffee cup" width={60} height={60} />
                )}
                {service.icon === 'bean' && (
                  <Image src="/icons/singlebean.png" alt="Coffee bean" width={60} height={60} />
                )}
                {service.icon === 'double-bean' && (
                  <Image src="/icons/doublebean.png" alt="Double coffee beans" width={60} height={60} />
                )}
              </div>
              <h3 className="text-2xl md:text-3xl mb-2 text-center">
                {service.title}
              </h3>
              {service.subtitle && (
                <p className="text-lg mb-4 opacity-90 text-center">
                  {service.subtitle}
                </p>
              )}
              <p className="text-base opacity-95 flex-grow text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className={`${condition.bgColor} text-white rounded-2xl p-8 h-full flex flex-col`}
            >
              <div className="mb-6 flex justify-center">
                <condition.icon size={60} className="text-[var(--brown-dark)]" />
              </div>
              <h3 className="text-2xl md:text-3xl mb-4 text-center">
                {condition.title}
              </h3>
              <p className="text-base opacity-95 text-center">
                {condition.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}