// ¡Esta línea es crucial para que los hooks de React funcionen!
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaPlay, FaPause } from 'react-icons/fa';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    title: 'La Rumbera XYZ',
    artist: '¡Tan Latina Cómo Tú!',
    artwork: '/default-artwork.png' // Necesitarás esta imagen en la carpeta `public`
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Efecto para controlar el play/pause del audio
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Error al reproducir:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  // Efecto para escuchar los cambios del script de Centova (VERSIÓN CON DEBUG)
  useEffect(() => {
    const observerCallback: MutationCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        // Nos interesa solo cuando el atributo 'src' del <img> espía cambia
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          const newArtworkUrl = (mutation.target as HTMLImageElement).src;

          // --- Depuración Clave ---
          //console.log('¡Atributo src modificado! Nueva URL capturada:', newArtworkUrl);

          // Actualizamos el título y artista también, por si acaso
          const newTitle = document.getElementById('cc-title-hidden')?.textContent;
          const newArtist = document.getElementById('cc-artist-hidden')?.textContent;

          setSongInfo(prev => ({
            ...prev,
            title: newTitle || prev.title,
            artist: newArtist || prev.artist,
            artwork: newArtworkUrl,
          }));
        }
      }
    };

    // Creamos el observer
    const observer = new MutationObserver(observerCallback);
    
    // El objetivo a vigilar ahora es nuestro <img> espía
    const artworkSpy = document.getElementById('cc-artwork-spy');

    if (artworkSpy) {
      // Le decimos que vigile cambios en sus atributos
      observer.observe(artworkSpy, { attributes: true });
    }

    // Limpieza
    return () => observer.disconnect();
  }, []); // El array vacío es importante para que solo se ejecute una vez

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <>
      {/* Elementos ocultos para que el script de Centova escriba la información */}
      <div style={{ display: 'none' }}>
        {/* Spans para el texto */}
        <span id="cc-title-hidden" className="cc_streaminfo" data-type="tracktitle" data-username="larumbera"></span>
        <span id="cc-artist-hidden" className="cc_streaminfo" data-type="trackartist" data-username="larumbera"></span>
        
        {/* ¡NUESTRO CABALLO DE TROYA! Un <img> real pero oculto */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          id="cc-artwork-spy" 
          className="cc_streaminfo" 
          data-type="trackimageurl" 
          data-username="larumbera"
          alt=""
        />
      </div>

      <audio ref={audioRef} src="https://play10.tikast.com/proxy/larumbera?mp=/stream" preload="none"></audio>
      
      {/* Reproductor Fijo en la parte inferior */}
      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white flex justify-center items-center z-50 border-t border-gray-200">
        <div className="flex items-center space-x-4 p-2">
          
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image 
              src={songInfo.artwork} 
              alt="Carátula de la canción" 
              fill={true} // `fill` es la forma moderna en lugar de `layout="fill"`
              sizes="(max-width: 768px) 10vw, (max-width: 1200px) 10vw, 10vw"
              priority={true} // Le damos prioridad ya que siempre es visible
              className="rounded-md object-cover"
              // Si la imagen da error (ej. URL rota), vuelve a la imagen por defecto.
              onError={() => setSongInfo(prev => ({...prev, artwork: '/default-artwork.png'}))}
            />
            <button 
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-3xl transition-opacity hover:bg-opacity-70 rounded-md"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-rumbera-yellow truncate max-w-[200px] sm:max-w-xs">{songInfo.title}</h2>
            <p className="text-md text-rumbera-blue truncate max-w-[200px] sm:max-w-xs">{songInfo.artist}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
