<template>
<div>
	<div id="map"></div>
	<WFS-search
		:debounce-delay="350"
		wfs-url="http://localhost:8600/geoserver/wfs"
		query-template="*%v*"
		:type-names="['iran:state','iran:county','iran:city','iran:roads', 'iran:forestpark','iran:lakes', 'iran:district', 'iran:settlements']"
		v-model="srchResult"
	>
		<template slot-scope="{ term, update }">
			<input type="text" :v-model="term" v-on:input="update($event.target.value)">
		</template>
	</WFS-search>
</div>
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

	import WFSSearch from '@/components/WFSSearch'
	import WFS from 'ol/format/WFS';
	import Point from 'ol/geom/Point';
	import Feature from 'ol/Feature';
	import GML from 'ol/format/GML';
export default {
	name: "Map",
	components: {
		WFSSearch,
	},
	data() {
		return {
			found: [],
			map: null,
			vectorSource: null,
			srchResult: null,
		}
	},
	mounted() {
		// const vectorSource = new VectorSource({
		// 	format: new GeoJSON(),
		// 	url: function (extent) {
		// 		return (
		// 			'http://localhost:8600/geoserver/wfs?service=WFS&' +
		// 			'version=1.1.0&request=GetFeature&typename=iran:water&' +
		// 			'outputFormat=application/json&srsname=EPSG:3857&' +
		// 			'bbox=' +
		// 			extent.join(',') +
		// 			',EPSG:3857'
		// 		);
		// 	},
		// 	strategy: bboxStrategy,
		// });
		// const vector = new VectorLayer({
		// 	source: vectorSource,
		// 	style: new Style({
		// 		stroke: new Stroke({
		// 			color: 'rgba(0, 0, 255, 1.0)',
		// 			width: 2,
		// 		}),
		// 	}),
		// });


		this.vectorSource = new VectorSource();
		const vector = new VectorLayer({
			source: this.vectorSource,
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
					url: 'http://192.168.34.42:8600/geoserver/wms',
					params: {'LAYERS': 'iran:gp-iran', 'TILED': true, 'VERSION': '1.3.0'},
					serverType: 'geoserver',
					transition: 0,
				}),
			}),
			vector,
		];
		let x = new Map({
			layers: layers,
			target: 'map',
			view: new View({
				center: [5964457.55554387, 3884488.746230995],
				zoom: 5,
			}),
		});
		this.map = x
		x.on('click', (evt) => {
			console.log(evt, evt.coordinate);
			
			const wfs = new WFS();
			var feature = new Feature({
				geometry: new Point(evt.coordinate),
				name: 'My Polygon',
				title: 'asdf',
				
				
			});
			console.log(feature)

			const format = new GML({})
			const gml = format.writeGeometry(new Point(evt.coordinate_))

			let node = wfs.writeTransaction([feature], [], [], {featureNS: 'http://localhost:8600/iran' ,featureType: 'iran:event', srsName: 'EPSG:3857', version: '1.1.0' })
			fetch('http://localhost:8600/geoserver/wfs', {
				method: 'POST',
				body: new XMLSerializer().serializeToString(node)
			})
			.then(res=> res.json() )
			.then(res => {
				console.log('##', res)
			})
			console.log(node)
			// wfs.writeFeatures(gml, {})
		})
	},
	methods: {
	},
	watch: {
		srchResult(val) {
			this.vectorSource.clear();
			if (!val.numberReturned) return
			const features = new GeoJSON().readFeatures(val);
			this.vectorSource.addFeatures(features);
			this.map.getView().fit(this.vectorSource.getExtent(), {
				duration: 450,

			});
		}
	},
};
</script>

<style lang="scss" scoped>
#map {
	height: 100%;
	width: 100%
}
</style>