mapboxgl.accessToken = 'pk.eyJ1IjoiZW10YWMiLCJhIjoiY2w5ejR0bXZyMGJpbDNvbG5jMTFobGJlZCJ9.UMi2J2LPPuz0qbFaCh0uRA'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
projection: 'globe', //globe projection rather than the default web mercator
center: [-103.31002, 29.2498], // starting position [lng, lat]
zoom: 9.8, // starting zoom
pitch: 45,
//bearing: 80,
});
map.on('load', () => {
  map.addSource('trails', {
      type: 'geojson',
      data: 'data/Big_Bend_Trails.geojson' // note, you'll have to change this if your data file is not in an enclosing folder named 'data'
  });

  map.addLayer({
    'id': 'trails-layer',
    'type': 'line',
    'source': 'trails',
    'paint': {
        'line-width': 3,
        'line-color': ['match', ['get', 'TRLCLASS'],
            'Class 1: Minimally Developed', 'red',
            'Class 2: Moderately Developed', 'orange',
            'Class 3: Developed', 'yellow',
            /*else,*/ 'blue'
]
    }
  });
  map.addSource('bounds', {
        type: 'geojson',
        data: 'data/BigBendBounds.geojson'// note again, you may need to change this.
    });

  map.addLayer({
      'id': 'boundary-layer',
      'type': 'line',
      'source': 'bounds',
      'paint': {
          'line-width': 4,
          'line-color': 'black',
          'line-opacity': .6
      }
    });
});
    // When a click event occurs on a feature in the trails layer,
    // open a popup at the location of the click, with description
    // HTML from the click event's properties.
  map.on('click', 'trails-layer', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML("<b>Trail Name:</b> " + e.features[0].properties.TRLNAME + "<br><b>Class:</b> " + e.features[0].properties.TRLCLASS + "<br><b>Length:</b> " + Math.round((e.features[0].properties.Miles + Number.EPSILON) * 100) / 100 + "mi")
    .addTo(map);
    });

    // Change the cursor to a pointer when
    // the mouse is over the trails layer.
  map.on('mouseenter', 'trails-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back to a pointer
    // when it leaves the trails layer.
  map.on('mouseleave', 'trails-layer', () => {
    map.getCanvas().style.cursor = '';
    });

  map.on('load', function () {
       map.addSource('mapbox-dem', {
           "type": "raster-dem",
           "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
           'tileSize': 512,
           'maxzoom': 14
       });
        map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.1});
        // add sky styling with `setFog` that will show when the map is highly pitched
        map.setFog({
          'horizon-blend': 0.3,
          'color': '#bdc7c9',
          'high-color': '#add8e6',
          'space-color': '#d8f2ff',
          'star-intensity': 0.0
  });
});

  const navControl = new mapboxgl.NavigationControl({
        visualizePitch: true
    });
    map.addControl(navControl, 'top-right');

  const scale = new mapboxgl.ScaleControl({
    maxWidth: 200,
    unit: 'imperial'
    });
    map.addControl(scale, 'bottom-left');

    scale.setUnit('imperial');
