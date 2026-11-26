# Laferrere Movilidad — prototipo de prueba

PWA independiente, móvil y con selector interactivo de líneas 86, 88 y 96. No pertenece al Municipio ni a una empresa de colectivos.

## Alcance actual
- Las líneas 86, 88 y 96 aparecen en el listado oficial de cobertura de la app Cuándo SUBO para Ciudad y Gran Buenos Aires.
- La selección solo cambia la línea mostrada y enlaza a la fuente oficial.
- **No hay integración de API, GPS, mapas, recorridos, paradas ni horarios propios.** No se simulan posiciones ni tiempos.
- Para agregar datos propios hace falta una fuente vigente y permiso de uso. El dataset GTFS consultado en BA Data está suspendido/revisión y describe colectivos de CABA; no sirve como feed actual de Laferrere.

Fuentes consultadas:
- https://www.argentina.gob.ar/aplicaciones/cuandosubo
- https://www.argentina.gob.ar/cuandosubo/lineas-incluidas
- https://data.buenosaires.gob.ar/dataset/colectivos-gtfs (el portal informa que sus datos API/GTFS están suspendidos y en revisión; publicado originalmente en 2019; CABA)

## Publicación
Sitio estático; GitHub Pages despliega la raíz del repositorio mediante Actions.
