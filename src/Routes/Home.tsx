import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
    background-color: black;
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
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.$photo});
    background-size: cover;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    font-size: 40px;
`;

const Overview = styled.p`
    width: 60%;
    font-size: 18px;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    position: absolute;
    display: grid;
    grid-template-columns: repeat(6, 2fr);
    gap: 5px;
    width: 100%;
`;

const Box = styled(motion.div)<{ $photo: string }>`
    height: 200px;
    background: url(${(props) => props.$photo}) center/cover;
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [sliderPage, setSliderPage] = useState(0);
    const [sliderLeaving, setSliderLeaving] = useState(false);
    const sliderOffset = 6;

    /**@function increaseIndex
     * 1. data(API)가 있으면 아래 기능들 수행
     * 2. Row의 Animation이 실행 중이면 아무것도 return하지않음
     * 3. toggleLeaving 함수 실행(sliderLeaving_bool타입 변수의 값을 toggle)
     * 4. data를 한 페이지당 6개 보여줬을 때 몇 페이지가 나오는지 계산 후(배너에 보여준 data 한 개는 제외)
     * 5. 마지막 페이지에 도달했을 경우 다시 sliderPage 변수 값 0으로 변경해서 첫 페이지 보여주기
     * 6. 마지막 페이지가 아닐 경우 sliderPage 변수 값 +1
     */
    const increaseIndex = () => {
        if (data) {
            if (sliderLeaving) return;
            toggleLeaving();

            const totalMovies = data.results.length - 1;
            const maxIndex = Math.ceil(totalMovies / sliderOffset) - 1;
            setSliderPage((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    /**@function toggleLeaving
     * 1. leaving(bool타입) 변수의 값을 반대 값으로 변경(true↔false)
     */
    const toggleLeaving = () => {
        setSliderLeaving((prev) => !prev);
    };

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner $photo={makeImagePath(data?.results[0].backdrop_path || "")} onClick={increaseIndex}>
                        <Title>{`${data?.results[0].original_title} (${data?.results[0].title})`}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                key={sliderPage}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(sliderOffset * sliderPage, sliderOffset * sliderPage + sliderOffset)
                                    .map((movie) => (
                                        <Box key={movie.id} $photo={makeImagePath(movie.backdrop_path, "w500")} />
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
