import axios, { AxiosResponse } from 'axios';
import mongoose from 'mongoose';
import { errorHandler } from '../utils/errorHandler';
import { RequestBody } from '../middleware/is-auth';

import redis_client from '../utils/redisClient';

import movieGenres from '../models/movieGenres';
import seriesGenres from '../models/seriesGenres';

import { NextFunction, Response } from 'express';

interface configuration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
}

interface ApiResponseSchema {
  page: number;
  results: {
    poster_path: string;
    adult: boolean;
    overview: string;
    release_date: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    original_title: string;
    original_name: string;
    original_language: string;
    title: string;
    name: string;
    backdrop_path: string;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
  }[];
  total_results: number;
  total_pages: number;
}

const tmdb_apihost_baseUrl = 'https://api.themoviedb.org/3';

const genresRemap = (arr: { _id: mongoose.Types.ObjectId; id: number; name: string }[]) => {
  return arr.reduce((obj, item) => ({ ...obj, [item.id]: item.name }), {});
};

const getRandomGenres = async (caps_content: string) => {
  // get a random set of genres and store it in the random_genre var
  let random_genres: string[];
  // gets the random genres from the cache memory, if it doesnt exists, query the database and cache it
  const redisContentGenres = await redis_client.get(`random${caps_content}Genres`);
  if (!redisContentGenres) {
    const fetchRandom_genres =
      caps_content === 'Movie'
        ? await movieGenres.aggregate([{ $sample: { size: 4 } }])
        : await seriesGenres.aggregate([{ $sample: { size: 4 } }]);
    // remap the mongoose return query to return the genre name only
    random_genres = fetchRandom_genres.map((genre) => genre.name);
    // randomMovieGenres or randomTvGenres
    redis_client.setEx(`random${caps_content}Genres`, 86400, JSON.stringify(random_genres));
  } else {
    random_genres = JSON.parse(redisContentGenres);
  }
  return random_genres;
};

export const getTMDBConfig = async (req: RequestBody, res: Response, next: NextFunction) => {
  const url = `${tmdb_apihost_baseUrl}/configuration?api_key=${process.env.tmdb_api_key}`;
  try {
    const data = await redis_client.get('configuration');
    let response;
    if (!data) {
      response = await axios.get<configuration>(url);
      await redis_client.setEx('configuration', 259200, JSON.stringify(response.data));
    }

    res.status(200).json({ configuration: data ? JSON.parse(data) : response?.data });
  } catch (error) {
    errorHandler(error, next);
  }
};

// To fetch content from TMDB api

// the fucntion accepts the url path,next function,page number defaults to and the redis key

const getContent = async (getPath: string, next: NextFunction, getKey: string, page: number = 1, getGenres?: string) => {
  //get the path for eg /movie/top_rated and getting the 'movie' parameter

  const type = getPath.split('/')[1];
  let genres: Record<number, string>;

  // collecting genres based on the parameter of type (movie or series) from database and remapping it to an object

  // genres:{    id: name    }

  // this is needed to populate the genre array in to reponse schema with the coresponding genres to the ids

  // response = genre['11','2'] => genre['action', 'crime']
  try {
    if (type === 'movie') {
      const redisData = await redis_client.get('movieGenres');
      if (!redisData) {
        const fetchedGenres = await movieGenres.find({}).exec();
        genres = genresRemap(fetchedGenres);
        await redis_client.set('movieGenres', JSON.stringify(genres));
      } else {
        genres = JSON.parse(redisData);
      }
    } else {
      const redisData = await redis_client.get('seriesGenres');
      if (!redisData) {
        const fetchedGenres = await seriesGenres.find({}).exec();
        genres = genresRemap(fetchedGenres);
        await redis_client.set('seriesGenres', JSON.stringify(genres));
      } else {
        genres = JSON.parse(redisData);
      }
    }

    // creating the dynamic url based on the path {https://api.themoviedb.org/3/{getPath}?api_key=<<api_key>>}

    const { data }: AxiosResponse<ApiResponseSchema> = await axios({
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

    // callig tmdb api to fetch results and remap it
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
    await redis_client.rPush(getKey, JSON.stringify(fetchedData));
    await redis_client.expire(getKey, 86400);
    return fetchedData;
  } catch (error) {
    errorHandler(error, next);
  }
};

export const getBrowseContent = async (req: RequestBody, res: Response, next: NextFunction) => {
  const content = req.params.slug === 'movies' ? 'movie' : 'tv';
  const caps_content = content[0].toUpperCase() + content.slice(1).toLowerCase();
  try {
    // get the toprated {'topRatedMovies' or 'topRatedTvs'}
    const redisTopRated = await redis_client.lRange(`topRated${caps_content}s`, 0, 0);

    let topRated;
    if (redisTopRated.length <= 0) {
      // /movie/top_rated or /tv/top_rated

      const topRatedUrl = `/${content}/top_rated`;
      topRated = await getContent(topRatedUrl, next, `topRated${caps_content}s`);
    } else {
      topRated = JSON.parse(redisTopRated[0]);
    }

    const random_genres = await getRandomGenres(caps_content);

    // check if the fetched genre keys already exists in the cache

    const cachedCurated = await Promise.all(random_genres.map((genre: string) => redis_client.lRange(genre, 0, 0)));

    // for genre keys that are not cached, call the get content function and fetch it

    const curated = await Promise.all(
      cachedCurated.map((item, index) => {
        const getPath = `/discover/${content}`;
        if (item.length <= 0) {
          const genre = random_genres[index];
          return getContent(getPath, next, genre, index + 1, genre);
        }
        return item;
      })
    );

    // remaps the curated movies into an object of array into
    // curatedMovies :{
    //   genre:[
    //     {
    //       this can be either the result object from the movie response or a json string
    //     }
    //   ]
    // }
    const remappedCurated: Record<string, string[] | Pick<ApiResponseSchema, 'results'>[]> = curated.reduce(
      (obj, item, index) => ({ ...obj, [random_genres[index]]: item }),
      {}
    );

    // if the genre is a json string from the cached memory, transform it into an array of movie data schema

    for (const key in remappedCurated) {
      const content = remappedCurated[key][0];
      if (typeof content === 'string') {
        remappedCurated[key] = JSON.parse(content);
      }
    }
    res.status(200).json({ message: 'Heres a list of content', content: { TopRated: topRated, ...remappedCurated } });
  } catch (error) {
    errorHandler(error, next);
  }
};
