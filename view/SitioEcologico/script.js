function ajustarSidebar() {
            const cabecalho = document.getElementById("cabecalho");
            const sidebar = document.getElementById("mySidebar");

            // Altura real do cabeçalho
            const alturaCabecalho = cabecalho.offsetHeight;

            // Aplica dinamicamente
            sidebar.style.top = alturaCabecalho + "px";
            sidebar.style.height = `calc(100% - ${alturaCabecalho}px)`;
        }

        function toggleNav() {
            const sidebar = document.getElementById("mySidebar");
            const btn = document.querySelector(".openbtn");

            if (sidebar.style.width === "250px") {
                // FECHAR
                sidebar.style.width = "0";
                btn.classList.remove("menu-open");
            } else {
                // ABRIR
                ajustarSidebar();
                sidebar.style.width = "250px";
                btn.classList.add("menu-open");
            }
        }

        /* ✅ Rolagem da galeria */
        const gallery = document.querySelector('.gallery');
        const scrollAmount = 100;

        function scrollUp() {
            gallery.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
            });
        }

        function scrollDown() {
            gallery.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }

        function abrirGaleriaMobile() {
            const botoes = document.querySelector('.botao-menu-mobile');
            const galeria = document.querySelector('.gallery-container');

            // Esconde botões e mostra galeria
            botoes.classList.add('hidden');
            galeria.classList.add('mobile-active', 'show-back-button');
        }

        function voltarMenu() {
            const botoes = document.querySelector('.botao-menu-mobile');
            const galeria = document.querySelector('.gallery-container');

            // Volta ao menu normal
            botoes.classList.remove('hidden');
            galeria.classList.remove('mobile-active', 'show-back-button');
        }

        // Recalcula caso a tela mude de tamanho
        window.addEventListener("resize", ajustarSidebar);
        window.addEventListener("load", ajustarSidebar);









        // Inicializa o mapa
        const map = L.map('map', {
            zoomControl: false,
            maxZoom: 22,      // permite zoom maior no mapa (mas depende dos tiles)
            zoomSnap: 0.25,   // permite passos fracionários se desejar
            zoomDelta: 0.25
        }).setView([-23.2965, -45.9658], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,        // máximo oferecido pelo provedor (OSM = 19)
            maxNativeZoom: 19,  // forças uso do nível nativo; se >19 os tiles não existirão
            attribution: '© OpenStreetMap',
            detectRetina: false
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        

        function ajustarAlturaMapa() {
            const header = document.getElementById("cabecalho");
            const altura = header.offsetHeight;
            document.documentElement.style.setProperty('--altura-header', altura + "px");

            // garantir que o Leaflet recalcule o tamanho após mudança de layout
            if (typeof map !== 'undefined') {
                // pequeno delay garante que o layout do DOM esteja estabilizado
                setTimeout(() => map.invalidateSize(), 200);
            }
        }

        // URLs dos arquivos GeoJSON
        const geojsonUrl1 = 'http://localhost:5000/geojson?banco=Sitio_Ecologico&tabela=collection_geojson_cache&key=pontos_cafe';
        const geojsonUrl2 = 'http://localhost:5000/geojson?banco=Sitio_Ecologico&tabela=collection_geojson_cache&key=linhas_plantio';

        const layers = {};

        // estilos de exemplo (substitua conforme necessário)
        const RioStyle = { color: '#0077be', weight: 2 };
        const EstradasStyle = { color: '#a52a2a', weight: 3, dashArray: '4' };
        const cafeIcon = L.icon({
            iconUrl: 'img/icone_cafe.svg',
            iconSize: [30, 30],   // ajuste como quiser
            iconAnchor: [15, 15], // centraliza
        });


        function loadGeoJSON(name, url, style = null) {
            if (!url) {
                console.error('URL inválida para', name);
                return;
            }

            fetch(url)
                .then(r => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.json();
                })
                .then(data => {
                    layers[name] = L.geoJSON(data, {
                        style: style, // usado para linhas/polígonos

                        // este bloco é usado somente se for geometria tipo Point
                        pointToLayer: (feature, latlng) => {
                            return L.circleMarker(latlng, {
                                radius: 5,
                                fillColor: style?.color || "#ff0000",
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }
                    }).addTo(map);
                })
                .catch(err => {
                    console.error(`Erro carregando GeoJSON "${name}" de ${url}:`, err);
                });
        }

        // chaves/URLs corretas
        loadGeoJSON("rios", geojsonUrl1, RioStyle);
        loadGeoJSON("estradas", geojsonUrl2, EstradasStyle);