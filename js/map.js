// State
var state = {
  'perspective': 'extruded',
  'selection': 'combined',
};

// Booli API Auth
var auth = {};
auth.callerId = "bopriskarta";
auth.time = Math.round(Date.now() / 1000);
auth.unique = Math.random().toString(8).slice(0, 15)
var shasum = new jsSHA("SHA-1", "TEXT");
shasum.update(auth.callerId + auth.time + "1KpJKCMVFzZ2s2YqEv3CPqTMUmzl76V5mwNiQw1a" + auth.unique);
auth.hash = shasum.getHash("HEX");

// Define height and color stops
var sqmprices = _.range(0, 115000, 5000)
var sqmprice_height_stops = sqmprices.map(function (e, i) {
  return [e, e/10];
});
var prices = _.range(0, 14000000, 250000)
var price_height_stops = prices.map(function (e, i) {
  return [e, e/1000];
});
var sqmprice_color_stops = [
  [9236, "#4575b4"],
  [21265, "#74add1"],
  [27455, "#abd9e9"],
  [32628, "#e0f3f8"],
  [38891, "#ffffbf"],
  [47135, "#fee090"],
  [59069, "#fdae61"],
  [79984, "#f46d43"],
  [113000, "#d73027"],
];
var price_color_stops = [
  [1188684, "#4575b4"],
  [2738977, "#74add1"],
  [3402967, "#abd9e9"],
  [4000397, "#e0f3f8"],
  [4725219, "#ffffbf"],
  [5715213, "#fee090"],
  [7025697, "#fdae61"],
  [9020642, "#f46d43"],
  [13584587, "#d73027"],
];

// Define map layers
var layer_templates = {
  'flat': {
    'id': '',
    'type': 'fill',
    'source': 'composite',
    'source-layer': '',
    'paint': {
      'fill-color': {
        'property': 'sqmprice',
        'stops': price_color_stops
      },
      'fill-opacity': .4
    }
  },
  'contour': {
    'id': '',
    'type': 'line',
    'source': 'composite',
    'source-layer': '',
    'paint': {
      'line-color': "#666"
    }
  }
};

// Deep copy templates
var layers = {
  'apt': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'apt-clicked': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'apt-extruded': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'apt-extruded-clicked': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'apt-contours': JSON.parse(JSON.stringify(layer_templates['contour'])),

  'combined': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'combined-clicked': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'combined-extruded': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'combined-extruded-clicked': JSON.parse(JSON.stringify(layer_templates['flat'])),
  'combined-contours': JSON.parse(JSON.stringify(layer_templates['contour'])),
};

// Flat layers
layers['apt']['id'] = 'apt-polygons';
layers['apt']['source-layer'] = 'sthlm-lan-sqmprice-polygons-60k';
layers['apt']['paint']['fill-color']['stops'] = sqmprice_color_stops;
layers['apt-clicked'] = JSON.parse(JSON.stringify(layers['apt']));
layers['apt-clicked']['id'] = 'apt-polygons-clicked';
layers['apt-clicked']['filter'] = ['==', 'id', ''];
layers['apt-clicked']['paint']['fill-opacity'] = 0.8;

layers['combined']['id'] = 'combined-polygons';
layers['combined']['source-layer'] = 'sthlm-lan-combined-pricepolygons';
layers['combined-clicked'] = JSON.parse(JSON.stringify(layers['combined']));
layers['combined-clicked']['id'] = 'combined-polygons-clicked';
layers['combined-clicked']['filter'] = ['==', 'id', ''];
layers['combined-clicked']['paint']['fill-opacity'] = 0.8;

// Contour layers
layers['apt-contours']['id'] = 'apt-contours';
layers['apt-contours']['source-layer'] = 'sthlm-lan-apt-contours-60k-hires';
layers['combined-contours']['id'] = 'combined-contours';
layers['combined-contours']['source-layer'] = 'sthlm-lan-combined-contours-60k-';

// Extruded (3D) layers
layers['apt-extruded']['id'] = 'apt-extruded';
layers['apt-extruded']['source-layer'] = 'sthlm-lan-sqmprice-polygons-60k';
layers['apt-extruded']['paint']['fill-color']['stops'] = sqmprice_color_stops;
layers['apt-extruded']['paint']['fill-opacity'] = 0.5;
layers['apt-extruded']['paint']['fill-extrude-height'] = {
  'property': 'sqmprice',
  'stops': sqmprice_height_stops
};
layers['apt-extruded-clicked'] = JSON.parse(JSON.stringify(layers['apt-extruded']));
layers['apt-extruded-clicked']['id'] = 'apt-extruded-clicked';
layers['apt-extruded-clicked']['filter'] = ['==', 'id', ''];
layers['apt-extruded-clicked']['paint']['fill-opacity'] = 0.4;

layers['combined-extruded']['id'] = 'combined-extruded';
layers['combined-extruded']['source-layer'] = 'sthlm-lan-combined-pricepolygons';
layers['combined-extruded']['paint']['fill-color']['stops'] = price_color_stops;
layers['combined-extruded']['paint']['fill-opacity'] = 0.5;
layers['combined-extruded']['paint']['fill-extrude-height'] = {
  'property': 'sqmprice',
  'stops': price_height_stops
};
layers['combined-extruded-clicked'] = JSON.parse(JSON.stringify(layers['combined-extruded']));
layers['combined-extruded-clicked']['id'] = 'combined-extruded-clicked';
layers['combined-extruded-clicked']['filter'] = ['==', 'id', ''];
layers['combined-extruded-clicked']['paint']['fill-opacity'] = 0.4;

var togglableLayers = {
  'flat': {
    'apt': ['apt-polygons', 'apt-polygons-clicked', 'apt-contours'],
    'combined': ['combined-polygons', 'combined-polygons-clicked', 'combined-contours'],
  },
  'extruded': {
    'apt': ['apt-extruded', 'apt-extruded-clicked'],
    'combined': ['combined-extruded', 'combined-extruded-clicked'],
  },
};



// Init map
var extruded_pitch = 35;
var flat_pitch = 0;

mapboxgl.accessToken = 'pk.eyJ1IjoiaGVucmlrYWxtZXIiLCJhIjoiY2l1bnh1dDBiMDAxODJ6bDhic3pwYWs4ZCJ9.G1n-UDNUax12ps_jlfR_Og';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/henrikalmer/civckwt8u00bs2imge4ws21qz',
  center: [18.0686, 59.3293],
  zoom: 10,
  minZoom: 9,
  pitch: extruded_pitch,
});

// Set up map on load
map.on('load', function () {
  // Add layers
  map.addLayer(layers['apt']);
  map.addLayer(layers['apt-clicked']);
  map.addLayer(layers['apt-contours']);
  map.addLayer(layers['apt-extruded']);
  map.addLayer(layers['apt-extruded-clicked']);
  map.addLayer(layers['combined']);
  map.addLayer(layers['combined-clicked']);
  map.addLayer(layers['combined-contours']);
  map.addLayer(layers['combined-extruded']);
  map.addLayer(layers['combined-extruded-clicked']);

  // Set visibility
  var updateMap = function(state) {
    visible_layers = togglableLayers[state['perspective']][state['selection']]
    for (key in layers) {
      map.setLayoutProperty(layers[key]['id'], 'visibility', 'none');
    }
    for (var i = 0; i < visible_layers.length; i++) {
      map.setLayoutProperty(visible_layers[i], 'visibility', 'visible');
    }
    if (state['perspective'] == 'extruded') {
      map.setPitch(extruded_pitch);
    } else {
      map.setPitch(flat_pitch);
    }
  };
  updateMap(state);

  // Toggle selection and perspective on click
  var links = document.getElementsByClassName('ot-toggle');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(e) {
      state['selection'] = e.target.getAttribute('href').split('#')[1];
      updateMap(state);
    }, false);
  }
  document.getElementById('persp-toggle').addEventListener('click', function(e) {
    state['perspective'] = e.target.getAttribute('href').split('#')[1];
    if (state['perspective'] === 'extruded') {
      e.target.href = '#flat';
      e.target.innerHTML = '2D';
    } else {
      e.target.href = '#extruded';
      e.target.innerHTML = '3D';
    }
    updateMap(state);
  }, false);

  // Show area info on click
  map.on('click', function (e) {
    var active_layer_id = togglableLayers[state['perspective']][state['selection']][0];
    var highlight_layer_id = togglableLayers[state['perspective']][state['selection']][1];
    var features = map.queryRenderedFeatures(e.point, { layers: [active_layer_id] });
    var feature;
    if (features.length) {
      feature = features[0];
      map.setFilter(highlight_layer_id, ['==', 'id', feature.properties.id]);
    } else {
      map.setFilter(highlight_layer_id, ['==', 'id', '']);
    }

    var center_point = turf.center(feature);
    var areas = 'https://api.booli.se/areas?lat=' + center_point.geometry.coordinates[1] + '&lng=' + center_point.geometry.coordinates[0] + '&' + Object.keys(auth).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(auth[k])}`).join('&');
    console.log(areas);
    
    var unit = 'kvadratmeterpris';
    if (state['selection'] == 'combined') unit = 'pris';
    var popup = new mapboxgl.Popup()
      .setLngLat(map.unproject(e.point))
      .setHTML("Genomsnittligt " + unit + ": " + feature.properties.sqmprice.toLocaleString('sv-SE', {style:'currency', currency: 'SEK', maximumFractionDigits: 0}))
      .addTo(map);
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
});