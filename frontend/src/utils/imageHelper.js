// Helper function to get movie poster image
const getMoviePoster = (posterUrl) => {
    if (!posterUrl) return null;

    // If it's already a full URL, return it
    if (posterUrl.startsWith('http')) {
        return posterUrl;
    }

    // If it's a local asset path
    if (posterUrl.includes('/src/assets/')) {
        const filename = posterUrl.split('/').pop();
        try {
            return require(`../assets/${filename}`);
        } catch (e) {
            console.error('Image not found:', filename);
            return null;
        }
    }

    // If it's an uploaded file
    if (posterUrl.startsWith('uploads/')) {
        return `http://localhost/cine/backend/${posterUrl}`;
    }

    return null;
};

export default getMoviePoster;
