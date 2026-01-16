/**
 * API Configuration and Endpoints
 */
export const API = {
    characters: '/api/characters',
    character: (id) => `/api/characters/${id}`,
    starred: '/api/starred',
    toggleStar: (id) => `/api/characters/${id}/star`,
    deleteChar: (id) => `/api/characters/${id}`,
    restore: (id) => `/api/characters/${id}/restore`
};

/**
 * HTTP Client for API calls
 */
export class ApiClient {
    /**
     * GET request
     */
    static async get(url) {
        const response = await fetch(url);
        return await response.json();
    }

    /**
     * POST request
     */
    static async post(url, data = null) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        return await response.json();
    }

    /**
     * DELETE request
     */
    static async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        return await response.json();
    }
}
