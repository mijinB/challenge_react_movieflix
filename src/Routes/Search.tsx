import React from "react";
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
    position: absolute;
    top: ${(props) => props.$top}px;
    font-size: 20px;
    font-weight: 600;
`;

const NoData = styled.div<{ $top: number }>`
    position: relative;
    top: ${(props) => props.$top}px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background-color: ${(props) => props.theme.black.veryDark};
    color: ${(props) => props.theme.black.lighter};
    font-size: 35px;
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

    // useEffect(() => {
    //     searchMovieResearch();
    //     searchTvResearch();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [keyword]);

    return (
        <Wrapper>
            {searchMovieIsLoading && searchTvIsLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <SliderWrapper>
                    <>
                        <Category $top={150}>MOVIE</Category>
                        {searchMovieData && searchMovieData?.results.length > 0 ? (
                            <MovieSlider
                                section="search"
                                keyPlus="searchMovie"
                                data={searchMovieData && searchMovieData}
                                top={200}
                                buttonTop={712}
                            />
                        ) : (
                            <NoData $top={200}>Not Found Data</NoData>
                        )}
                    </>
                    <>
                        <Category $top={480}>TV</Category>
                        {searchTvData && searchTvData?.results.length > 0 ? (
                            <TvSlider
                                section="search"
                                keyPlus="searchTv"
                                data={searchTvData && searchTvData}
                                top={530}
                            />
                        ) : (
                            <NoData $top={330}>Not Found Data</NoData>
                        )}
                    </>
                </SliderWrapper>
            )}
        </Wrapper>
    );
}

export default React.memo(Search);
