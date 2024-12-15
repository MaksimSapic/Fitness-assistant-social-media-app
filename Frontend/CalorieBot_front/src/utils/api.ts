export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const tokensString = localStorage.getItem('tokens');
    if (!tokensString) {
        console.error('No tokens found in localStorage');
        window.location.href = '/login';
        return;
    }

    const tokens = JSON.parse(tokensString);
    if (!tokens.access) {
        console.error('No access token found');
        window.location.href = '/login';
        return;
    }

    console.log('Token being used:', tokens.access); // Debug log

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${tokens.access}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            console.error('Authentication failed:', await response.text());
            localStorage.removeItem('tokens');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
