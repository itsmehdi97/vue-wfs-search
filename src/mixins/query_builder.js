import { WFS } from 'ol/format';
import {
  like as likeFilter,
} from 'ol/format/filter';

const FILTER_TYPES = ['filter-function', 'cql', 'ecql']

export default {
	name: 'QueryBuilder',
	components: {},
	props: {
		filterType: {
			type: String,
			default: 'filter-function',
			validator: (v) => FILTER_TYPES.includes(v.toLowerCase())
		},
		queryTemplate: {
			type: String | Function,
			default: '%v',
			validator: (v) => v.includes('%v')
		},
		typeNames: {
			type: Array,
			required: true,
			validator: v => v.length > 0
		},
		featurePrefix: {
			type: String,
			required: false,
		},
		srsName: {
			type: String,
			default: 'EPSG:3857'
		},
		featureNS: {
			type: String,
			default: 'http://openstreemap.org'
		},
		outputFormat: {
			type: String,
			default: 'application/json'
		},
		waitTime: {
			type: Number,
			default: 300
		}
	},
	data() {
		return {
			searchTerm: null
		}
	},
	computed: {
		search() {
			const { queryTemplate, searchTerm } = this;
			if (!searchTerm) return null

			return typeof queryTemplate === 'string'
				? queryTemplate.replaceAll('%v', searchTerm)
				: queryTemplate(searchTerm)
		},
		query() {
			const { search, srsName, featurePrefix, typeNames, featureNS, outputFormat } = this
			if (!search) return;
			let featureQuery = new WFS().writeGetFeature({
				srsName,
				maxFeatures: 200,
				featureNS,
				outputFormat,
				featurePrefix,
				featureTypes: typeNames,
				filter: likeFilter('name', search),
			})
			return this.serializeQuery(featureQuery)
		}
	},
	methods: {
		serializeQuery(q) {
			if (!q) return null
			return new XMLSerializer().serializeToString(q)
		},
	},
};