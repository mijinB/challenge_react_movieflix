import styled from "styled-components";
import { IGetTvResult, getAiringTodayTv, getPopularTv, getTopRatedTv } from "../api";
import { useQuery } from "react-query";
import { makeImagePath } from "../utils";
import TvSlider from "../Components/TvSlider";

const Wrapper = styled.div`
    padding-bottom: 970px;
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
    justify-content: center;
    height: 100vh;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24, 1)), url(${(props) => props.$photo});
    background-size: cover;
    word-break: keep-all;
    h2 {
        margin-bottom: 20px;
        font-size: 40px;
        font-weight: 600;
    }
    p {
        width: 48%;
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

function Tv() {
    const { data: airingData, isLoading: airingIsLoading } = useQuery<IGetTvResult>(
        ["airingTv", "airingToday"],
        getAiringTodayTv
    );
    const { data: topRatedData, isLoading: topRatedIsLoading } = useQuery<IGetTvResult>(
        ["topRatedTv", "topRated"],
        getTopRatedTv
    );
    const { data: popularData, isLoading: popularIsLoading } = useQuery<IGetTvResult>(
        ["popularTv", "popular"],
        getPopularTv
    );

    return (
        <Wrapper>
            {airingIsLoading && topRatedIsLoading && popularIsLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner $photo={makeImagePath(airingData?.results[0].backdrop_path || "")}>
                        <h2>{`${airingData?.results[0].original_name} (${airingData?.results[0].name})`}</h2>
                        <p>{airingData?.results[0].overview}</p>
                    </Banner>
                    <SliderWrapper>
                        <Category $top={-50}>오늘 방송되는 프로그램</Category>
                        <TvSlider section="tv" keyPlus="airing" data={airingData!} top={-25} buttonTop={712} />
                        <Category $top={280}>7일 동안 방송되는 프로그램</Category>
                        <TvSlider section="tv" keyPlus="topRated" data={topRatedData!} top={305} buttonTop={1066} />
                        <Category $top={610}>인기 많은 프로그램</Category>
                        <TvSlider section="tv" keyPlus="popularTv" data={popularData!} top={635} buttonTop={1420} />
                    </SliderWrapper>
                </>
            )}
        </Wrapper>
    );
}

export default Tv;
