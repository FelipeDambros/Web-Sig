// ------------------------- Remove coordenadas Z do GeoJSON -------------------------
function removeZCoordinate(geom) {
    if (geom.type === 'MultiPolygon') {
        geom.coordinates = geom.coordinates.map(polygon =>
            polygon.map(ring =>
                ring.map(([x, y]) => [x, y])
            )
        );
    }
    return geom;
}

// ------------------------- Remove acentos e símbolos dos atributos -------------------------
function normalizeProperties(geojson) {
    return {
        ...geojson,
        features: geojson.features.map((feature) => {
            const cleanProps = {};
            for (const key in feature.properties) {
                const cleanKey = key.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9_]/g, '_');
                const value = feature.properties[key];
                cleanProps[cleanKey] = typeof value === 'string'
                    ? value.normalize('NFD').replace(/[̀-ͯ]/g, '')
                    : value;
            }
            return { ...feature, properties: cleanProps };
        })
    };
}

// ------------------------- Normaliza MultiPolygon e MultiPoint -------------------------
function normalizarGeoJSON(geojson) {
    const result = { type: "FeatureCollection", features: [] };
    geojson.features.forEach(feature => {
        if (!feature.geometry) return;
        const { type, coordinates } = feature.geometry;

        if (type === "MultiPolygon") {
            coordinates.forEach(polygon => {
                result.features.push({ type: "Feature", properties: feature.properties, geometry: { type: "Polygon", coordinates: polygon } });
            });
        } else if (type === "MultiPoint" && coordinates.length === 1) {
            result.features.push({ type: "Feature", properties: feature.properties, geometry: { type: "Point", coordinates: coordinates[0] } });
        } else {
            result.features.push(feature);
        }
    });
    return result;
}

module.exports = { removeZCoordinate, normalizeProperties, normalizarGeoJSON };
