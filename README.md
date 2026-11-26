# Laferrere Movilidad — prototipo

PWA independiente con mapa interactivo para explorar algunos trazados AMBA de las líneas 86, 88 y 96 publicados por el Ministerio de Transporte. No es una app municipal ni de las empresas de colectivos.

## Qué hace hoy
- Muestra en un mapa el trazado seleccionado por línea, variante y sentido (IDA/VUELTA).
- Permite pedir la ubicación del teléfono y resalta cuál de los trazados guardados está geométricamente más cerca. Esa distancia se calcula contra una geometría histórica aproximada: no indica parada cercana ni presencia de un colectivo.
- La información cartográfica se almacena en `routes.json`; no redirige al usuario a otra app para ver el recorrido.
- No ofrece paradas individuales, horarios, predicción de llegada ni ubicación GPS de unidades.

## Fuente y límites
- Dataset: Ministerio de Transporte, “Recorridos de servicios de colectivos AMBA”; recurso “Recorrido por línea”. Ficha: https://datos.transporte.gob.ar/dataset/recorridos-de-servicios-de-colectivos-amba
- Licencia indicada por el publicador: Creative Commons Attribution 4.0 (CC BY 4.0). Atribución visible en la interfaz y aquí.
- El portal indica fecha de actualización del dataset: 12/04/2023, frecuencia eventual. Los trazados no se verificaron en campo y pueden estar desactualizados o contener variantes históricas.
- Se filtraron trazas que atraviesan el área central aproximada de Gregorio de Laferrere; la app conserva la geometría completa de cada variante seleccionada. Los nombres IDA/VUELTA, variantes y operadores vienen del recurso.
- Mapa base: OpenStreetMap, con atribución visible en el mapa y pie de página.
- Cuándo SUBO publica cobertura en vivo para estas líneas; esta PWA no consume su API ni reproduce posiciones GPS. No hay integración no autorizada.

## Publicación
Sitio estático en GitHub Pages; GitHub Actions publica la raíz del repositorio.
