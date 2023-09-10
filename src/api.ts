const API_KEY = "f13a7085232be4cb764611232b620804";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`).then((response) =>
        response.json()
    );
}
