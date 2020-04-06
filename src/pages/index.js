import Helmet from "react-helmet";
import axios from "axios";
import L from "leaflet";

import Layout from "components/Layout";
import Container from "components/Container";
import React from "react";
import Map from "components/Map";

const LOCATION = {
  lat: 0,
  lng: 0,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
const max_Zoom = 5;
const min_Zoom = 2;
// const northEast = L.LatLng(-89.981557, -180);
// const southWest = L.LatLng(89.981557, 180);
// const bounds = L.LatLngBounds(southWest, northEast);

const IndexPage = () => {
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      response = await axios.get("https://corona.lmao.ninja/countries");
    } catch (e) {
      console.log("Failed to fetch countries: ${e.message}", e);
      return;
    }

    const { data = [] } = response;
    console.log(data);

    const hasData = Array.isArray(data) && data.length > 0;

    if (!hasData) return;

    const geoJson = {
      type: "FeautureCollection",
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: "Feature",
          properties: {
            ...country,
          },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      }),
    };
    console.log(geoJson);

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = [], latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const {
          country,
          updated,
          cases,
          deaths,
          recovered,
          active,
        } = properties;

        casesString = `${cases}`;

        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`;
        }

        if (updated) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html = `
      <span class="icon-marker">
        ${casesString}
      </span>
      `;

        return L.marker(latlng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        })
          .bindPopup({ className: "info-popup" })
          .setPopupContent(
            `<h2>${country}</h2> <ul>
          <li><strong>Confirmed:</strong> ${cases}</li>
          <li><strong>Deaths:</strong> ${deaths}</li>
          <li><strong>Recovered:</strong> ${recovered}</li>
          <li><strong>Active Cases:</strong> ${active}</li>
          <li><strong>Last Update:</strong> ${updatedFormatted}</li>
      </ul>`
          )
          .openPopup();
      },
    });

    {
      /* <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                  <li><strong>Confirmed:</strong> ${cases}</li>
                  <li><strong>Deaths:</strong> ${deaths}</li>
                  <li><strong>Recovered:</strong> ${recovered}</li>
                  <li><strong>Active Cases:</strong> ${active}</li>
                  <li><strong>Last Update:</strong>${updatedFormatted}</li>
              </ul>
          </span> */
    }

    geoJsonLayers.addTo(map);
  }

  // const northEast = L.LatLng(-89.981557, -180);
  // const southWest = L.LatLng(89.981557, 180);
  // const bounds = L.LatLngBounds(southWest, northEast);
  // map.panTo([50, 30]);
  // map.panTo({lon: 30, lat: 50});
  // map.panTo({lat: 50, lng: 30});
  // map.panTo(L.latLng(50, 30));

  const bounds = [
    [89.98, 180],
    [-89.98, -180],
  ];

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    maxZoom: max_Zoom,
    minZoom: min_Zoom,
    maxBounds: bounds,
    maxBoundsViscosity: 0.9,
    mapEffect,
  };

  return (
    <Layout pageName="COVID Map">
      <Helmet>
        <title>COVID Map</title>
      </Helmet>

      <Map {...mapSettings} />
    </Layout>
  );
};

export default IndexPage;
