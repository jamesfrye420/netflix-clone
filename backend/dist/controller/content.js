"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowseContent = exports.getTMDBConfig = void 0;
const axios_1 = __importDefault(require("axios"));
const errorHandler_1 = require("../utils/errorHandler");
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const movieGenres_1 = __importDefault(require("../models/movieGenres"));
const seriesGenres_1 = __importDefault(require("../models/seriesGenres"));
const tmdb_apihost_baseUrl = 'https://api.themoviedb.org/3';
const genresRemap = (arr) => {
    return arr.reduce((obj, item) => ({ ...obj, [item.id]: item.name }), {});
};
const getRandomGenres = async (caps_content) => {
    let random_genres;
    const redisContentGenres = await redisClient_1.default.get(`random${caps_content}Genres`);
    if (!redisContentGenres) {
        const fetchRandom_genres = caps_content === 'Movie'
            ? await movieGenres_1.default.aggregate([{ $sample: { size: 4 } }])
            : await seriesGenres_1.default.aggregate([{ $sample: { size: 4 } }]);
        random_genres = fetchRandom_genres.map((genre) => genre.name);
        redisClient_1.default.setEx(`random${caps_content}Genres`, 86400, JSON.stringify(random_genres));
    }
    else {
        random_genres = JSON.parse(redisContentGenres);
    }
    return random_genres;
};
const getTMDBConfig = async (req, res, next) => {
    const url = `${tmdb_apihost_baseUrl}/configuration?api_key=${process.env.tmdb_api_key}`;
    try {
        const data = await redisClient_1.default.get('configuration');
        let response;
        if (!data) {
            response = await axios_1.default.get(url);
            await redisClient_1.default.setEx('configuration', 259200, JSON.stringify(response.data));
        }
        res.status(200).json({ configuration: data ? JSON.parse(data) : response?.data });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, next);
    }
};
exports.getTMDBConfig = getTMDBConfig;
const getContent = async (getPath, next, getKey, page = 1, getGenres) => {
    const type = getPath.split('/')[1];
    let genres;
    try {
        if (type === 'movie') {
            const redisData = await redisClient_1.default.get('movieGenres');
            if (!redisData) {
                const fetchedGenres = await movieGenres_1.default.find({}).exec();
                genres = genresRemap(fetchedGenres);
                await redisClient_1.default.set('movieGenres', JSON.stringify(genres));
            }
            else {
                genres = JSON.parse(redisData);
            }
        }
        else {
            const redisData = await redisClient_1.default.get('seriesGenres');
            if (!redisData) {
                const fetchedGenres = await seriesGenres_1.default.find({}).exec();
                genres = genresRemap(fetchedGenres);
                await redisClient_1.default.set('seriesGenres', JSON.stringify(genres));
            }
            else {
                genres = JSON.parse(redisData);
            }
        }
        const { data } = await (0, axios_1.default)({
            url: getPath,
            method: 'get',
            baseURL: tmdb_apihost_baseUrl,
            params: {
                api_key: process.env.tmdb_api_key,
                language: 'en-US',
                page: page,
                with_genres: getGenres,
            },
        });
        const fetchedData = data.results.map((result) => {
            return {
                id: result.id,
                title: result.title || result.original_title || result.name || result.original_name,
                poster_path: result.poster_path,
                backdrop_path: result.backdrop_path,
                release_date: result.release_date || result.first_air_date,
                overview: result.overview,
                genres: result.genre_ids.map((id) => {
                    if (genres[id]) {
                        return genres[id];
                    }
                }),
            };
        });
        await redisClient_1.default.rPush(getKey, JSON.stringify(fetchedData));
        await redisClient_1.default.expire(getKey, 86400);
        return fetchedData;
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, next);
    }
};
const getBrowseContent = async (req, res, next) => {
    const content = req.params.slug === 'movies' ? 'movie' : 'tv';
    const caps_content = content[0].toUpperCase() + content.slice(1).toLowerCase();
    try {
        const redisTopRated = await redisClient_1.default.lRange(`topRated${caps_content}s`, 0, 0);
        let topRated;
        if (redisTopRated.length <= 0) {
            const topRatedUrl = `/${content}/top_rated`;
            topRated = await getContent(topRatedUrl, next, `topRated${caps_content}s`);
        }
        else {
            topRated = JSON.parse(redisTopRated[0]);
        }
        const random_genres = await getRandomGenres(caps_content);
        const cachedCurated = await Promise.all(random_genres.map((genre) => redisClient_1.default.lRange(genre, 0, 0)));
        const curated = await Promise.all(cachedCurated.map((item, index) => {
            const getPath = `/discover/${content}`;
            if (item.length <= 0) {
                const genre = random_genres[index];
                return getContent(getPath, next, genre, index + 1, genre);
            }
            return item;
        }));
        const remappedCurated = curated.reduce((obj, item, index) => ({ ...obj, [random_genres[index]]: item }), {});
        for (const key in remappedCurated) {
            const content = remappedCurated[key][0];
            if (typeof content === 'string') {
                remappedCurated[key] = JSON.parse(content);
            }
        }
        res.status(200).json({ message: 'Heres a list of content', content: { TopRated: topRated, ...remappedCurated } });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, next);
    }
};
exports.getBrowseContent = getBrowseContent;
//# sourceMappingURL=content.js.map