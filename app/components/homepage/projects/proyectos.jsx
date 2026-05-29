"use client";

import { useState } from 'react';
import { proyectosData } from '@/utils/data/proyectosData';
import ProyCard from './proy-card';

export default function Proyectos() {
  const [bigProyImgs, setBigProyImgs] = useState({});
  const updateBigProyImg = (proyectoId, imgURL) => {
    setBigProyImgs((prev) => ({ ...prev, [proyectoId]: imgURL }));
  };

  return (
    <div id="projects" className="max-w-screen-xl mx-auto md:w-5/6 lg:w-4/6 pt-10">
      <h2 className="text-4xl font-title font-extrabold tracking-wider leading-none md:text-5xl lg:text-5xl text-white text-center mt-5 mb-10">Proyectos</h2>
      <div className="grid place-content-center md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 md:mx-0 px-3 md:px-0">
        {proyectosData.map((proyecto) => {
          const bigProyImg = bigProyImgs[proyecto.id] || proyecto.imagenes[0];
          return (
            <div key={proyecto.id} className="overflow-hidden flex flex-col bg-black border border-grisclaro border-opacity-20 bg-opacity-20 rounded-lg">
              <div className="flex flex-col lg:flex-row justify-center items-center px-3">
                <div className="lg:order-2 w-full">
                  <img src={`/img/${bigProyImg}.webp`} alt={`imagen ${bigProyImg}`} className="w-full h-auto rounded-lg" />
                </div>
                <div className="flex lg:flex-col items-center space-x-4 lg:space-x-0 lg:space-y-2 justify-center lg:order-1">
                  {proyecto.imagenes.map((image, index) => (
                    <div key={index} className="transition-all duration-300 hover:shadow-[0_0_10px_1px_rgba(30,125,103,0.7)] rounded-lg">
                      <ProyCard
                        index={index}
                        imgURL={image}
                        changeBigProyImage={(proy) => updateBigProyImg(proyecto.id, proy)}
                        bigProyImg={bigProyImg}
                        isFirstImage={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-full flex flex-col justify-between px-5">
                <div>
                  <h5 className="flex flex-col my-3 text-xl text-center text-white font-bold tracking-tight">{proyecto.nombreProyecto}</h5>
                  <ul className="flex items-center justify-center gap-3 mb-2">
                    {proyecto.tecnologias.map((tecnologia, index) => (
                      <li key={index} className="flex items-center gap-1 text-text px-4 py-1.5 text-sm font-medium border border-text border-opacity-30 rounded-full bg-[#07090D] bg-opacity-60">
                        <img className="w-5 h-5" src={`/img/${tecnologia.image}.svg`} alt={`logo ${tecnologia.name}`} />
                        <p>{tecnologia.name}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-4 font-normal text-grisclaro2 [text-wrap:pretty]">{proyecto.descripcionProyecto}</p>
                </div>
                <div className="flex gap-3 items-center justify-center pb-5">
                  <a target="_blank" rel="noreferrer" href={proyecto.sitioWeb} className="flex flex-1 gap-1 items-center justify-center py-2.5 px-5 text-sm text-white font-medium  bg-colorboton rounded-full border transition duration-300 hover:bg-colorboton hover:scale-105 hover:shadow-[0_0_20px_3px_rgba(30,125,103,0.7)]">
                    Sitio Web 🌐
                  </a>
                  <a target="_blank" rel="noreferrer" href={proyecto.github} className="flex flex-1 gap-1 items-center justify-center py-2.5 px-5 text-sm text-white font-medium  bg-transparent rounded-full border transition duration-300 hover:bg-colorboton2 hover:scale-105 hover:shadow-[0_0_20px_3px_rgba(77,30,125,0.7)]">
                    Github 🐙
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
