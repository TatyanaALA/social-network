import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string(),
	username: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export function fetchUser(id: string): Promise<User> {
	return fetch(`/api/users/${id}`)
		.then((response) => response.json()
		.then((data) => UserSchema.parse(data)));
}

export function registerUser(username: string, password: string): Promise<void> {
	return fetch("/api/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({username, password}),
	}).then(() => undefined);
}

async function validateRespons(response: Response): Promise<Response> {
	if (!response.ok) {
		throw new Error(await response.text());
	}

	return response;
}

export function login(username: string, password: string): Promise<void> {
	return fetch("/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({username, password}),
	})
		.then(validateRespons)
		.then(() => undefined);
}