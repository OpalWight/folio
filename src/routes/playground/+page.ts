import { redirect } from '@sveltejs/kit';

// The playground became /work.
export function load() {
	throw redirect(301, '/work');
}
