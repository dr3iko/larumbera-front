"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WPMenuItem } from '@/types';
import { FaBars, FaTimes } from 'react-icons/fa';
import SocialMediaIcons, { SocialLink } from './SocialMediaIcons';

interface NavigationProps {
  menuItems: WPMenuItem[];
  socialLinks: SocialLink[];
}

/**
 * Convierte una URL absoluta de WordPress a una ruta relativa si es interna,
 * para aprovechar el enrutamiento de Next.js.
 */
const getRelativeUrl = (url: string): string => {
  try {
    const urlObject = new URL(url);
    // Si la URL es del mismo dominio que el sitio de WP o el frontend, devuelve solo la ruta.
    if (urlObject.hostname === 'larumbera.xyz' || urlObject.hostname === 'www.larumbera.xyz') {
      let pathname = urlObject.pathname;

      // Elimina el prefijo '/back' si existe
      if (pathname.startsWith('/back')) {
        pathname = pathname.substring(5); // 5 es la longitud de '/back'
      }

      // Si el pathname resultante no empieza con '/', se lo añadimos.
      // Esto cubre el caso de que el path sea '' (homepage) o 'blog'.
      if (!pathname.startsWith('/')) {
        pathname = '/' + pathname;
      }

      return pathname + urlObject.search + urlObject.hash;
    }
  } catch (e) {
    // Si no es una URL completa (ej. /blog), la devuelve tal cual.
    return url;
  }
  // Si es una URL externa, la devuelve completa.
  return url;
};


const Navigation = ({ menuItems, socialLinks }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  }

  // Efecto para cerrar el menú si la ruta cambia
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Efecto para evitar el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    };
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menú de escritorio: se oculta en pantallas pequeñas (hidden), se muestra como flex en grandes (lg:flex) */}
      <div className="hidden lg:flex items-center space-x-6">
        {menuItems.map((item) => (
          <Link
            key={item.ID}
            href={getRelativeUrl(item.url)}
            className="text-lg font-semibold text-rumbera-blue hover:text-rumbera-yellow transition-colors duration-300"
          >
            {item.title}
          </Link>
        ))}
        <SocialMediaIcons socialLinks={socialLinks} />
      </div>

      {/* Botón de hamburguesa para móvil: solo visible en pantallas pequeñas (lg:hidden) */}
      <div className="lg:hidden">
        <button
          onClick={toggleMenu}
          aria-label="Abrir menú"
          className="text-rumbera-blue text-3xl z-50 relative"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Overlay y menú móvil */}
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          {menuItems.map((item) => (
            <Link
              key={item.ID}
              href={getRelativeUrl(item.url)}
              className="text-3xl font-bold text-rumbera-blue hover:text-rumbera-yellow transition-colors duration-300"
              onClick={closeMenu}
            >
              {item.title}
            </Link>
          ))}
          <div className="mt-8">
            <SocialMediaIcons socialLinks={socialLinks} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;