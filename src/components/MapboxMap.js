import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import "./MapboxMap.css"; // Import the CSS file for styling

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapboxMap = ({ waypoints, onDistance }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const directions = useRef(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [78.9629, 20.5937],
        zoom: 5,
        width: "200px", // Set width as specified
        height: "500px", // Set height as specified
        position: "absolute", // Ensure absolute positioning
        top: "60px", // Set top position as specified
        left: "100px", // Set left position as specified
        right: "10px",
        gap: "0px", // No gap specified
        opacity: "1px", // Set opacity as specified
      });

      directions.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
      });

      map.current.addControl(directions.current, "top-left");

      directions.current.on("route", (e) => {
        const distance = e.route[0].distance / 1000; // Convert to kilometers
        onDistance(distance.toFixed(2)); // Callback to set the distance
      });
    }

    if (waypoints.length) {
      directions.current.setOrigin(waypoints[0]);
      directions.current.setDestination(waypoints[waypoints.length - 1]);
      waypoints
        .slice(1, -1)
        .forEach((waypoint, index) =>
          directions.current.addWaypoint(index, waypoint)
        );
    }
  }, [waypoints, onDistance]);

  return <div ref={mapContainer} className="map-container" />;
};

export default MapboxMap;
