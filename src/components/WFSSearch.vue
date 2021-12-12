<script>
import query_builder from '@/mixins/query_builder'
import utils from '@/utils'

export default {
	mixins: [query_builder],
	props: {
		initialTerm: {
			type: String | null,
			required: false
		},
		wfsUrl: {
			type: String,
			required: true
		},
		debounceDelay: {
			type: Number,
			default: 350
		}
	},
	data() {
		return {
			searchTerm: this.initialTerm
		}
	},
	render() {
		return this.$scopedSlots.default({
			term: this.searchTerm,
			update: utils.debounce(this.update, this.debounceDelay)
		})
	},
	methods: {
		update(v) {
			this.searchTerm = v
		}
	},
	watch: {
		query(val) {
			if (!val) return

			fetch(this.wfsUrl, {
				method: 'POST',
				body: val,
			})
			.then(res => {
				return res.json()
			})
			.then(json => {
				this.$emit('input', json)
			})
		}
	},
};
</script>

<style>
</style>