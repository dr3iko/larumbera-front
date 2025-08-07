import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Image from 'next/image'
import AudioPlayer from '@/components/AudioPlayer' // Usamos @ para importar desde src/
import Navigation from '@/components/Navigation' // Importamos el nuevo componente
import Link from 'next/link'
import { WPMenuItem, WPMenu } from '@/types'
import { fetchRestAPI } from '@/lib/api'

const inter = Inter({ subsets: ['latin'] })

async function getMenuItems(): Promise<WPMenuItem[]> {
  try {
    const menuData: WPMenu = await fetchRestAPI(`/wp-json/larumbera/v1/menu/primary`);
    // Si la ubicación no tiene un menú asignado, menuData puede no tener `items`.
    if (!menuData || !menuData.items) {
      throw new Error('La ubicación del menú "primary" no tiene un menú asignado o el endpoint no devolvió items.');
    }

    const wordpressBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL.replace('/graphql', '') : 'https://silpabon.com/back';

    const processedMenuItems = menuData.items.map(item => {
      let processedUrl = item.url;

      // Replace WordPress base URL with empty string for relative paths
      if (processedUrl.startsWith(wordpressBaseUrl)) {
        processedUrl = processedUrl.replace(wordpressBaseUrl, '');
      }

      // Ensure it starts with a / if it's not empty
      if (processedUrl === '') {
        processedUrl = '/';
      } else if (!processedUrl.startsWith('/')) {
        processedUrl = '/' + processedUrl;
      }

      return {
        ...item,
        url: processedUrl
      };
    });

    return processedMenuItems;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return []; // Devuelve un menú vacío si hay un error.
  }
}

export const metadata: Metadata = {
  title: 'La Rumbera XYZ - Tan Latina Como Tú',
  description: 'La emisora que te pone a gozar.',
  openGraph: {
    title: 'La Rumbera XYZ - Tan Latina Como Tú',
    description: 'La emisora que te pone a gozar.',
    url: 'https://larumbera.xyz',
    siteName: 'La Rumbera XYZ',
    images: [
      {
        url: 'https://larumbera.xyz/Redes_Sociales.webp',
        width: 1200,
        height: 630,
        alt: 'Logo La Rumbera XYZ',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItems = await getMenuItems();

  return ( 
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        
        <header className="bg-white shadow-md sticky top-0 z-40">
            <nav className="container mx-auto flex flex-row justify-between items-center px-6 py-2">
                <div>
                    <Link href="/" className="group/logo relative block h-20 w-80">
                        <Image
                            src="/Logo-La-Rumbera-Amarillo.png"
                            alt="Logo de La Rumbera XYZ"
                            fill
                            sizes="320px"
                            className="object-contain transition-opacity duration-300 group-hover/logo:opacity-0"
                            priority
                        />
                        <Image
                            src="/Logo-La-Rumbera-Azul.png"
                            alt="Logo de La Rumbera XYZ"
                            fill
                            sizes="320px"
                            className="object-contain opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100"
                            priority
                        />
                    </Link>
                </div>
                <Navigation menuItems={menuItems} />
            </nav>
        </header>

        {/* Contenedor Flex para alinear la ilustración y el contenido */}
        <div className="flex group/illustration">
            {/* Columna de la ilustración (fija a la izquierda en pantallas grandes) - la altura del reproductor se resta del 'bottom' */}
            <aside className="hidden lg:block fixed left-0 top-24 bottom-[var(--player-height)] w-80 -z-10">
                 <Image
                     src="/Ilustracion-Amarilla.png"
                     alt="Ilustración de una mujer latina"
                     fill
                     sizes="320px"
                     className="object-contain object-left transition-opacity duration-700 ease-in-out group-hover/illustration:opacity-0"
                 />
                 <Image
                     src="/Ilustracion-Azul.png"
                     alt="Ilustración de una mujer latina en color azul"
                     fill
                     sizes="320px"
                     className="object-contain object-left opacity-0 transition-opacity duration-700 ease-in-out group-hover/illustration:opacity-100"
                 />
            </aside>

            {/* Contenido principal con margen a la izquierda en pantallas grandes */}
            <main className="w-full lg:ml-80 container mx-auto px-5 py-8">
              {children}
            </main>
        </div>
        
        {/* Un div vacío para que el reproductor fijo no oculte el contenido del final de la página */}
        <div className="h-[var(--player-height)]" /> 

        <AudioPlayer />
        
        {/* El script de Centova se carga al final para no bloquear la página */}
        <Script 
          src="https://play10.tikast.com:2199/system/streaminfo.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}