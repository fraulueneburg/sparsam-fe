import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/flag-icons/flags',
					dest: '', // This will copy to "dist/flags"
				},
			],
		}),
	],
})
