import { ColumnLayer } from 'deck.gl'
import { HeatmapLayer } from 'deck.gl'
import settings from '../../../../settings/settings.json'
import { useSelector } from 'react-redux'

export default function AccessLayer({ data, cellSize }) {
  const accessToggle = useSelector((state) => [state.ACCESS_TOGGLE])
  // return new HeatmapLayer({
  //   id: 'heatmap-layer',
  //   colorRange: settings.map.layers.heatmap.colors,
  //   radiusPixels: 30,
  //   opacity: 0.3,
  //   threshold: 0.05,
  //   data,
  //   getPosition: (d) => d.coordinates,
  //   getWeight: (d) => d.values[accessToggle],
  //   updateTriggers: {
  //     getWeight: [accessToggle],
  //   },
  // })

  return new ColumnLayer({
    id: 'column-layer',
    data,
    shadowEnabled: false,
    material: false,
    diskResolution: 15,
    radius: 70,
    extruded: true,
    pickable: true,
    elevationScale: 0.5,
    getPosition: (d) => d.coordinates,
    colorRange: settings.map.layers.heatmap.colors,
    getFillColor: (d) => [255 * d.values[accessToggle], 82, 120, 200],
    getLineColor: [0, 0, 0],
    getElevation: (d) => d.values[accessToggle],
    updateTriggers: {
      getElevation: [accessToggle],
      getFillColor: [accessToggle],
    },
    // transitions: {
    //   getFillColor: 500,
    //   getElevation: 200,
    // },
  })
}
