import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/CoffeCup.jpg"
          alt="Coffee cup"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl mb-12 font-light italic py-10">
          Tómate un coffee break
        </h1>
        <br />
        <a
          href="#contacto"
          className="text-2xl w-[300px] h-[50px] inline-flex items-center justify-center bg-[#707070] text-white rounded-full font-medium font-poppins"
        >
          <p>Agenda hoy!</p>
        </a>
      </div>
    </section>
  );
}
