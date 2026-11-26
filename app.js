const lineSelect=document.getElementById('lineSelect');
const variantSelect=document.getElementById('variantSelect');
const directionSelect=document.getElementById('directionSelect');
const summary=document.getElementById('routeSummary');
const loading=document.getElementById('mapLoading');
const locateBtn=document.getElementById('locateBtn');
const locationResult=document.getElementById('locationResult');
let routes, map, routeLayer, endpointLayer, userLayer, locateMarker;
const colors={'86':'#d5ff58','88':'#62d8ff','96':'#ffae57'};

function buildVariantOptions(){
  if(!routes)return;
  const line=lineSelect.value;
  const variants=[...new Set(routes.features.filter(f=>f.properties.line===line).map(f=>f.properties.variant))].sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));
  variantSelect.replaceChildren(...variants.map(v=>{const o=document.createElement('option');o.value=v;o.textContent=`Variante ${v}`;return o}));
}
function getFeature(){return routes?.features.find(f=>f.properties.line===lineSelect.value&&f.properties.variant===variantSelect.value&&f.properties.direction===directionSelect.value)}
function renderRoute(fit=false){
  const f=getFeature();if(!f||!map)return;
  if(routeLayer)map.removeLayer(routeLayer);if(endpointLayer)map.removeLayer(endpointLayer);
  const lineColor=colors[f.properties.line]||'#d5ff58';
  routeLayer=L.geoJSON(f,{style:{color:lineColor,weight:6,opacity:.92,lineCap:'round',lineJoin:'round'}}).addTo(map);
  const coords=f.geometry.coordinates;const first=[coords[0][1],coords[0][0]],last=[coords.at(-1)[1],coords.at(-1)[0]];
  endpointLayer=L.layerGroup([
    L.circleMarker(first,{radius:6,color:'#10131d',weight:2,fillColor:lineColor,fillOpacity:1}).bindTooltip('Extremo del trazado publicado'),
    L.circleMarker(last,{radius:6,color:'#10131d',weight:2,fillColor:lineColor,fillOpacity:1}).bindTooltip('Extremo del trazado publicado')
  ]).addTo(map);
  const direction=f.properties.direction==='IDA'?'Ida':'Vuelta';
  summary.innerHTML=`<span class="summary-chip" style="--chip:${lineColor}">Línea ${f.properties.line}</span><span>Variante ${f.properties.variant} · ${direction}</span><small>Empresa en el registro: ${escapeText(f.properties.operator||'sin dato')}</small>`;
  locationResult.classList.add('hidden');
  if(fit)map.fitBounds(routeLayer.getBounds().pad(.08),{maxZoom:14});
}
function escapeText(value){const d=document.createElement('div');d.textContent=value;return d.innerHTML}
function pointSegmentDistanceMeters(p,a,b){
  const lat0=p[0]*Math.PI/180;const scaleX=111320*Math.cos(lat0),scaleY=110540;
  const px=p[1]*scaleX,py=p[0]*scaleY,ax=a[1]*scaleX,ay=a[0]*scaleY,bx=b[1]*scaleX,by=b[0]*scaleY;
  const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));
  return Math.hypot(px-(ax+t*dx),py-(ay+t*dy));
}
function findNearestRoute(position){
  const p=[position.coords.latitude,position.coords.longitude];let best=null;
  routes.features.forEach(f=>{const c=f.geometry.coordinates;let dist=Infinity;for(let i=1;i<c.length;i++)dist=Math.min(dist,pointSegmentDistanceMeters(p,[c[i-1][1],c[i-1][0]],[c[i][1],c[i][0]]));if(!best||dist<best.dist)best={feature:f,dist}});
  const f=best.feature;lineSelect.value=f.properties.line;buildVariantOptions();variantSelect.value=f.properties.variant;directionSelect.value=f.properties.direction;renderRoute(false);
  if(userLayer)map.removeLayer(userLayer);userLayer=L.layerGroup().addTo(map);
  locateMarker=L.circleMarker(p,{radius:8,color:'#fff',weight:3,fillColor:'#ff5578',fillOpacity:1}).bindTooltip('Tu ubicación').addTo(userLayer);
  const label=`El trazado publicado más cercano es la línea ${f.properties.line}, variante ${f.properties.variant} (${f.properties.direction==='IDA'?'ida':'vuelta'}), a unos ${Math.round(best.dist)} m de tu ubicación. Esto no confirma que el servicio siga vigente ni que haya un colectivo allí.`;
  locationResult.textContent=label;locationResult.classList.remove('hidden');map.fitBounds(L.featureGroup([locateMarker,routeLayer]).getBounds().pad(.18),{maxZoom:15});
}
lineSelect.addEventListener('change',()=>{buildVariantOptions();renderRoute(true)});
variantSelect.addEventListener('change',()=>renderRoute(true));
directionSelect.addEventListener('change',()=>renderRoute(true));
locateBtn.addEventListener('click',()=>{
  if(!navigator.geolocation){locationResult.textContent='Este navegador no ofrece ubicación.';locationResult.classList.remove('hidden');return}
  locateBtn.disabled=true;locateBtn.textContent='Buscando…';
  navigator.geolocation.getCurrentPosition(pos=>{findNearestRoute(pos);locateBtn.disabled=false;locateBtn.textContent='◎ Mi ubicación'},err=>{locationResult.textContent=err.code===1?'No diste permiso para usar tu ubicación. Podés habilitarlo desde el navegador.':'No se pudo obtener tu ubicación ahora.';locationResult.classList.remove('hidden');locateBtn.disabled=false;locateBtn.textContent='◎ Mi ubicación'},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
window.addEventListener('load',()=>{
  const installBtn=document.getElementById('installBtn');let promptEvent;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;installBtn.classList.remove('hidden')});
  installBtn.addEventListener('click',async()=>{if(!promptEvent)return;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;installBtn.classList.add('hidden')});
});
(async()=>{
  try{
    routes=await fetch('./routes.json').then(r=>{if(!r.ok)throw new Error('No se pudieron cargar los trazados');return r.json()});
    map=L.map('map',{zoomControl:false}).setView([-34.75,-58.585],12);
    L.control.zoom({position:'bottomright'}).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    buildVariantOptions();renderRoute(true);loading.classList.add('hidden');
  }catch(e){loading.textContent='No se pudieron cargar los trazados. Probá recargar con internet.';loading.classList.add('error')}
})();
