// Ẩn toàn bộ lỗi trên console (chỉ dùng khi dev)
import * as React from "react";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useRef, useEffect } from "react";

const TILE_URL = "http://localhost:3000/tile-redirect/{z}/{x}/{y}.png";
const TILE_SIZE = 512;

function App() {
  const [opacity, setOpacity] = useState(1);
  const mapRef = useRef(null);

  const handleMapLoad = (event) => {
    const map = event.target;
    mapRef.current = map;

    map.addSource("quyhoach-tiles", {
      type: "raster",
      tiles: [TILE_URL],
      tileSize: TILE_SIZE,
    });

    map.addLayer({
      id: "quyhoach-tile-layer",
      type: "raster",
      source: "quyhoach-tiles",
      paint: {
        "raster-opacity": opacity,
      },
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setPaintProperty("quyhoach-tile-layer", "raster-opacity", opacity);
    }
  }, [opacity]);

  // Hàm lật y trong transformRequest
  const transformRequest = (url, resourceType) => {
    if (resourceType === "Tile" && url.includes("/tile-redirect/")) {
      const matches = url.match(/tile-redirect\/(\d+)\/(\d+)\/(\d+)\.png/);
      if (matches) {
        const z = parseInt(matches[1]);
        const x = matches[2];
        const y = parseInt(matches[3]);
        const flippedY = Math.pow(2, z) - 1 - y;

        return {
          url: `/assets/quan72023/${z}/${x}/${flippedY}.png`,
        };
      }
    }

    return { url };
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          width: 190,
          display: "flex",
          gap: 10,
          flexDirection: "column",
          zIndex: 1,
          background: "#fff",
          padding: 12,
          borderRadius: 4,
          right: 10,
          top: 10,
        }}
      >
        <label style={{ size: 12 }}>{`Độ mờ của bản đồ: ${Math.floor((1 - opacity) * 100)} %`}</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          style={{}}
        />
      </div>

      <Map
        mapboxAccessToken="pk.eyJ1IjoibmdoaWxvbmdhbmgwMCIsImEiOiJjbWN3enFyd2swOG4zMmtxMDM5YWM3MXh3In0.rTm52MkSxTVjw2oE3b0BtA"
        initialViewState={{
          longitude: 106.721451,
          latitude: 10.734134,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
        style={{ width: "100vw", height: "100vh" }}
        projection="mercator"
        onLoad={handleMapLoad}
        transformRequest={transformRequest}
      />
    </div>
  );
}

export default App;
