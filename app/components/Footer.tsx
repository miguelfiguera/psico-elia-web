import { Phone, Instagram, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-16 md:py-20 px-4 bg-[var(--beige)]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-center md:text-left">
          {/* Name and Title */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl text-[var(--brown-dark)] mb-2 italic font-light">
              Eliana Martinez
            </h3>
            <p className="text-xl text-[var(--text-light)]">
              Psicóloga Online
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <h4 className="text-2xl text-[var(--brown-dark)] mb-4 italic">
              Contacto
            </h4>
            <div className="space-y-3 flex flex-col items-center">
              <a
                href="tel:+573118909491"
                className="flex items-center gap-3 text-[var(--text-light)] hover:text-[var(--brown-dark)] transition-colors justify-center"
              >
                <Phone size={20} />
                <span>+57 311 8909491</span>
              </a>

              <a
                href="https://instagram.com/psicoelia.co"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[var(--text-light)] hover:text-[var(--brown-dark)] transition-colors justify-center"
              >
                <Instagram size={20} />
                <span>@psicoelia.co</span>
              </a>

              <a
                href="https://linkedin.com/in/psicoeliaco"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[var(--text-light)] hover:text-[var(--brown-dark)] transition-colors justify-center"
              >
                <Linkedin size={20} />
                <span>psicoeliaco</span>
              </a>

              <a
                href="mailto:uncoffeebreak@psicoelia.com"
                className="flex items-center gap-3 text-[var(--text-light)] hover:text-[var(--brown-dark)] transition-colors justify-center"
              >
                <Mail size={20} />
                <span>uncoffeebreak@psicoelia.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--brown-light)]/20 text-center text-sm text-[var(--text-light)]">
          <p>© {new Date().getFullYear()} Psico Elia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}