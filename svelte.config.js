import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Vercel project runs Node 24; pinned so local builds on newer Node don't fail.
		adapter: adapter({ runtime: 'nodejs24.x' })
	}
};

export default config;
