import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	base: '/',
	build: {
		target: 'esnext',
	},
	plugins: [
		react(),
		svgr({
			exportAsDefault: true,
			svgrOptions: {
				icon: true,
			},
		}),
	],
})
