import { error } from '@sveltejs/kit';
import { projects, nextProject } from '$lib/projects';

export const prerender = true;

export function entries() {
	return projects.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const project = projects.find((p) => p.slug === params.slug);
	if (!project) throw error(404, 'Project not found');
	return { project, next: nextProject(params.slug) };
}
