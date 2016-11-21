// State
var state = {
  'perspective': 'extruded',
  'selection': 'apt',
};

// Define height and color stops
var sqmprices = _.range(0, 115000, 5000)
var sqmprice_height_stops = sqmprices.map(function (e, i) {
  return [e, e/10];
});
var prices = _.range(0, 22250000, 250000)
var price_height_stops = prices.map(function (e, i) {
  return [e, e/1000];
});
var sqmprice_color_stops = [
  [8653, "#4575b4"],
  [19058, "#74add1"],
  [24814, "#abd9e9"],
  [28888, "#e0f3f8"],
  [33997, "#ffffbf"],
  [42132, "#fee090"],
  [54107, "#fdae61"],
  [76227, "#f46d43"],
  [113021, "#d73027"],
];
var price_color_stops = [
  [923806, "#4575b4"],
  [2700251, "#74add1"],
  [3478935, "#abd9e9"],
  [4244821, "#e0f3f8"],
  [5298372, "#ffffbf"],
  [6867953, "#fee090"],
  [9102199, "#fdae61"],
  [12605582, "#f46d43"],
  [22102526, "#d73027"],
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
layers['apt']['source-layer'] = 'apts-sqmprice-polygons-final';
layers['apt']['paint']['fill-color']['stops'] = sqmprice_color_stops;
layers['apt-clicked'] = JSON.parse(JSON.stringify(layers['apt']));
layers['apt-clicked']['id'] = 'apt-polygons-clicked';
layers['apt-clicked']['filter'] = ['==', 'id', ''];
layers['apt-clicked']['paint']['fill-opacity'] = 0.8;

layers['combined']['id'] = 'combined-polygons';
layers['combined']['source-layer'] = 'combined-price-polygons-final';
layers['combined-clicked'] = JSON.parse(JSON.stringify(layers['combined']));
layers['combined-clicked']['id'] = 'combined-polygons-clicked';
layers['combined-clicked']['filter'] = ['==', 'id', ''];
layers['combined-clicked']['paint']['fill-opacity'] = 0.8;

// Contour layers
layers['apt-contours']['id'] = 'apt-contours';
layers['apt-contours']['source-layer'] = 'apts-sqmprice-contours-final';
layers['combined-contours']['id'] = 'combined-contours';
layers['combined-contours']['source-layer'] = 'combined-price-contours-log17';

// Extruded (3D) layers
layers['apt-extruded']['id'] = 'apt-extruded';
layers['apt-extruded']['source-layer'] = 'apts-sqmprice-polygons-final';
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
layers['combined-extruded']['source-layer'] = 'combined-price-polygons-final';
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
var extruded_pitch = 55;
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

  
  var updateMap = function(state) {
    // Clear selection
    var highlight_layer_id = togglableLayers[state['perspective']][state['selection']][1];
    map.setFilter(highlight_layer_id, ['==', 'id', '']);
    document.getElementById('info').style.visibility = 'hidden';

    // Set map layer visibility
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
      for (var i = 0; i < links.length; i++) {
        links[i].classList.remove('active');
      }
      e.target.classList.add('active');
      updateMap(state);
    }, false);
  }
  document.getElementById('toggle-3d').addEventListener('change', function(e) {
    if (e.target.checked) {
      state['perspective'] = 'extruded';
    } else {
      state['perspective'] = 'flat';
    }
    updateMap(state);
  }, false);

  // Show area info on click
  map.on('click', function (e) {
    var active_layer_id = togglableLayers[state['perspective']][state['selection']][0];
    var highlight_layer_id = togglableLayers[state['perspective']][state['selection']][1];
    var features = map.queryRenderedFeatures(e.point, { layers: [active_layer_id] });
    var feature, feature_id;
    if (features.length) {
      feature = features[0];
      feature_id = feature.properties.id
    } else {
      feature_id = ''
    }
    map.setFilter(highlight_layer_id, ['==', 'id', feature_id]);
    
    document.getElementById('info').style.visibility = 'visible';
    var unit = 'slutpris per kvadratmeter';
    if (state['selection'] == 'combined') unit = 'slutpris';
    var pricestring = "Genomsnittligt " + unit + ": <strong>" + parseInt(feature.properties.sqmprice).toLocaleString('sv-SE', {style:'currency', currency: 'SEK'} + "</strong>")
    var div = document.createElement('div');
    div.innerHTML = arealinks[feature.properties.id];
    var areaurl = div.firstChild.getAttribute("href");
    var areaname = div.firstChild.innerHTML;
    var button = "<a href=\"" + areaurl + "\" class=\"btn btn-default\" target=\"_blank\">Se alla bostäder till salu i " + areaname + "</a>"
    document.getElementById('info-price').innerHTML = "<p>" + pricestring + "</p>";
    document.getElementById('goto-listings').innerHTML = button;
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
});
