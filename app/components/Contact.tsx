'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contacto" className="py-20 md:py-32 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
            <Image
              src="/psicoElia34Picture.jpg"
              alt="Elia con café"
              fill
              className="object-cover"
            />
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-[var(--brown-dark)] mb-2 italic font-light text-center">
              Agenda un
            </h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-[var(--brown-dark)] mb-8 italic font-light text-center">
              Coffee Break
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre y Apellido"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-[var(--brown-dark)] text-white placeholder-white/70 rounded-full outline-none focus:ring-2 focus:ring-[var(--brown-light)]"
              />

              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center">
                  <Image
                    src="/colombianFlag.png"
                    alt="Colombian flag"
                    width={24}
                    height={16}
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="celular"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 pl-16 bg-[var(--brown-dark)] text-white placeholder-white/70 rounded-full outline-none focus:ring-2 focus:ring-[var(--brown-light)]"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Correo"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-[var(--brown-dark)] text-white placeholder-white/70 rounded-full outline-none focus:ring-2 focus:ring-[var(--brown-light)]"
              />

              <button
                type="submit"
                className="w-full px-6 py-4 bg-[var(--pink-accent)] text-white rounded-full hover:bg-opacity-90 transition-all duration-300 font-medium text-lg"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}