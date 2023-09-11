import { useQuery } from "react-query";
import { IGetMoviesResult, getNowPlayingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import MovieSlider from "../Components/MovieSlider";

const Wrapper = styled.div`
    padding-bottom: 1300px;
`;

const Loader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20vh;
`;

const Banner = styled.div<{ $photo: string }>`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 90vh;
    padding: 220px 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24, 1)), url(${(props) => props.$photo});
    background-size: cover;
    word-break: keep-all;
    h2 {
        width: 40%;
        margin-bottom: 35px;
        font-size: 40px;
        font-weight: 600;
    }
    p {
        width: 40%;
        font-size: 18px;
        line-height: 28px;
    }
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

function Home() {
    const { data: nowData, isLoading: nowIsLoading } = useQuery<IGetMoviesResult>(
        ["nowMovies", "nowPlaying"],
        getNowPlayingMovies
    );
    const { data: topData, isLoading: topIsLoading } = useQuery<IGetMoviesResult>(
        ["topMovies", "topRated"],
        getTopRatedMovies
    );
    const { data: upcomingData, isLoading: upcomingIsLoading } = useQuery<IGetMoviesResult>(
        ["upcomingMovies", "upcoming"],
        getUpcomingMovies
    );
    const { data: popularData, isLoading: popularIsLoading } = useQuery<IGetMoviesResult>(
        ["popularMovies", "popular"],
        getPopularMovies
    );

    return (
        <Wrapper>
            {nowIsLoading && topIsLoading && upcomingIsLoading && popularIsLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner $photo={makeImagePath(nowData?.results[0].backdrop_path || "")}>
                        <h2>{`${nowData?.results[0].original_title} (${nowData?.results[0].title})`}</h2>
                        <p>{nowData?.results[0].overview}</p>
                    </Banner>
                    <SliderWrapper>
                        <Category $top={-50}>지금 상영중인 영화</Category>
                        <MovieSlider section="movies" keyPlus="now" data={nowData!} top={-25} buttonTop={859} />
                        <Category $top={280}>TOP 평점 영화</Category>
                        <MovieSlider section="movies" keyPlus="top" data={topData!} top={305} buttonTop={1213} />
                        <Category $top={610}>지금 인기 많은 영화</Category>
                        <MovieSlider section="movies" keyPlus="popular" data={popularData!} top={635} buttonTop={1567} />
                        <Category $top={940}>개봉 예정 영화</Category>
                        <MovieSlider
                            section="movies"
                            keyPlus="upcoming"
                            data={upcomingData!}
                            top={965}
                            buttonTop={1921}
                        />
                    </SliderWrapper>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
