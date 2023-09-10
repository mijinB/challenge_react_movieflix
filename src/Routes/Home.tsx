import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    padding-bottom: 200px;
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
    font-weight: 600;
`;

const Overview = styled.p`
    width: 48%;
    font-size: 18px;
    line-height: 28px;
    word-break: keep-all;
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

const Box = styled(motion.div)`
    height: 200px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const BoxImg = styled(motion.div)<{ $photo: string }>`
    width: 100%;
    height: 100%;
    background: url(${(props) => props.$photo}) center/cover;
`;

const BoxInfo = styled(motion.div)`
    width: 100%;
    padding: 10px;
    background-color: ${(props) => props.theme.black.darker};
    opacity: 0;
    text-align: center;
    font-weight: 600;
    h2 {
        font-size: 14px;
    }
    h3 {
        font-size: 11px;
    }
`;

const DetailInfoBox = styled(motion.div)`
    position: absolute;
    bottom: -210px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 550px;
    height: 400px;
    background-color: black;
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

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -30,
        transition: {
            type: "tween",
            delay: 0.5,
            duration: 0.3,
        },
    },
};

const boxInfoVariants = {
    hover: {
        opacity: 1,
        transition: {
            type: "tween",
            delay: 0.5,
            duration: 0.3,
        },
    },
};

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [sliderPage, setSliderPage] = useState(0);
    const [sliderLeaving, setSliderLeaving] = useState(false);
    const sliderOffset = 6;

    const navigate = useNavigate();
    const detailInfoBox = useMatch("/movies/:movieId");
    console.log(detailInfoBox);

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

    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
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
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            variants={boxVariants}
                                            initial="nomal"
                                            whileHover="hover"
                                            transition={{ type: "tween" }}
                                            onClick={() => onBoxClicked(movie.id)}
                                        >
                                            <BoxImg $photo={makeImagePath(movie.backdrop_path, "w500")} />
                                            <BoxInfo variants={boxInfoVariants}>
                                                <h2>{movie.title}</h2>
                                                <h3>{movie.original_title}</h3>
                                            </BoxInfo>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {detailInfoBox ? <DetailInfoBox layoutId={detailInfoBox.params.movieId} /> : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
