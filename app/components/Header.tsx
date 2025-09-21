// 'use client'

// import { useState } from 'react'
// import { Menu, X } from 'lucide-react'

export default function Header() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header>
      <div className="text-center bg-white py-6 h-[50px] flex items-center justify-center">
        <p className="text-[#2A2725] font-bold text-[35px] font-poppins">
          ¡PRIMERA CITA TOTALMENTE GRATIS!
        </p>
      </div>

      {/* Navigation commented out for now */}
      {/* <div className="container mx-auto px-4">
        <div className="flex items-center justify-center md:justify-between h-16">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[var(--brown-dark)] absolute right-4"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex space-x-8 mx-auto">
            <a href="#inicio" className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors">
              Inicio
            </a>
            <a href="#sobre-mi" className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors">
              Sobre mí
            </a>
            <a href="#servicios" className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors">
              Servicios
            </a>
            <a href="#paquetes" className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors">
              Paquetes
            </a>
            <a href="#contacto" className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors">
              Contacto
            </a>
          </nav>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[var(--brown-light)]/20">
            <div className="flex flex-col space-y-3">
              <a
                href="#inicio"
                className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </a>
              <a
                href="#sobre-mi"
                className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre mí
              </a>
              <a
                href="#servicios"
                className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </a>
              <a
                href="#paquetes"
                className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Paquetes
              </a>
              <a
                href="#contacto"
                className="text-[var(--brown-dark)] hover:text-[var(--brown-medium)] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
            </div>
          </nav>
        )}
      </div> */}
    </header>
  );
}
