import { useSearchParams } from "react-router-dom";
import { IGetMoviesResult, IGetTvResult, getSearchMovie, getSearchTv } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import MovieSlider from "../Components/MovieSlider";
import TvSlider from "../Components/TvSlider";

const Wrapper = styled.div`
    padding-bottom: 50px;
`;

const Loader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20vh;
`;

const SliderWrapper = styled.div`
    padding: 0 20px;
`;

const Category = styled.h3<{ $top: number }>`
    position: relative;
    top: ${(props) => props.$top}px;
    font-size: 20px;
    font-weight: 600;
`;

function Search() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");

    const { data: searchMovieData, isLoading: searchMovieIsLoading } = useQuery<IGetMoviesResult>(
        ["searchMovie", "searchMovieKeyword"],
        () => getSearchMovie(keyword ?? "")
    );
    const { data: searchTvData, isLoading: searchTvIsLoading } = useQuery<IGetTvResult>(
        ["searchTv", "searchTvKeyword"],
        () => getSearchTv(keyword ?? "")
    );

    return (
        <Wrapper>
            {searchMovieIsLoading && searchTvIsLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <SliderWrapper>
                    <Category $top={150}>MOVIE</Category>
                    <MovieSlider keyPlus="searchMovie" data={searchMovieData!} top={175} />
                    <Category $top={480}>TV</Category>
                    <TvSlider keyPlus="searchTv" data={searchTvData!} top={505} />
                </SliderWrapper>
            )}
        </Wrapper>
    );
}

export default Search;
