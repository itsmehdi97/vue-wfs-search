<template>
	<div id="map"></div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import TileLayer from 'ol/layer/Tile';
	import TileWMS from 'ol/source/TileWMS';
	import View from 'ol/View';

	import GeoJSON from 'ol/format/GeoJSON';
	import VectorSource from 'ol/source/Vector';
	import {Stroke, Style} from 'ol/style';
	import {Vector as VectorLayer} from 'ol/layer';
	import {bbox as bboxStrategy} from 'ol/loadingstrategy';


export default {
	name: "Map",
	props: {

	},
	data() {
		return {
			map: null
		}
	},
	created() {
			
	},
	mounted() {
		const vectorSource = new VectorSource({
			format: new GeoJSON(),
			url: function (extent) {
				return (
					'http://localhost:8600/geoserver/wfs?service=WFS&' +
					'version=1.1.0&request=GetFeature&typename=iran:water&' +
					'outputFormat=application/json&srsname=EPSG:3857&' +
					'bbox=' +
					extent.join(',') +
					',EPSG:3857'
				);
			},
			strategy: bboxStrategy,
		});
		const vector = new VectorLayer({
			source: vectorSource,
			style: new Style({
				stroke: new Stroke({
					color: 'rgba(0, 0, 255, 1.0)',
					width: 2,
				}),
			}),
		});


		const layers = [
			new TileLayer({
				source: new TileWMS({
					url: 'http://localhost:8600/geoserver/wms',
					params: {'LAYERS': 'iran:gp-iran', 'TILED': true, 'VERSION': '1.3.0'},
					serverType: 'geoserver',
					transition: 0,
				}),
			}),
			vector,
		];
		this.map = new Map({
			layers: layers,
			target: 'map',
			view: new View({
				center: [5964457.55554387, 3884488.746230995],
				zoom: 7,
			}),
		});
		this.map.on('click', (evt) => {
			console.log(evt, evt.coordinate)
		})
	}
};
</script>

<style>
</style>