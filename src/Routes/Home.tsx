import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";

const Wrapper = styled.div`
    background-color: black;
`;

const Loader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20vh;
`;

const Banner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    padding: 60px;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    font-size: 40px;
`;

const Overview = styled.p`
    width: 60%;
    font-size: 18px;
`;

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner>
                        <Title>{`${data?.results[0].original_title} (${data?.results[0].title})`}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
