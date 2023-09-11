const API_KEY = "f13a7085232be4cb764611232b620804";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    original_title: string;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    original_name: string;
    name: string;
    overview: string;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
}

export interface IGetTvResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export function getNowPlayingMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=kr`).then((response) =>
        response.json()
    );
}

export function getTopRatedMovies() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&region=kr`).then((response) =>
        response.json()
    );
}

export function getUpcomingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=kr`).then((response) =>
        response.json()
    );
}

export function getPopularMovies() {
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR&region=kr`).then((response) =>
        response.json()
    );
}

export function getAiringTodayTv() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=en-US`).then((response) => response.json());
}

export function getTopRatedTv() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=en-US`).then((response) => response.json());
}

export function getPopularTv() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US`).then((response) => response.json());
}

export function getSearchMovie($keyword: string) {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${$keyword}&language=en-US`).then((response) =>
        response.json()
    );
}

export function getSearchTv($keyword: string) {
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${$keyword}&language=en-US`).then((response) =>
        response.json()
    );
}
