import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";
import { IGetMoviesResult } from "../api";

const Slider = styled.div<{ $top: number }>`
    position: relative;
    top: ${(props) => props.$top}px;
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

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const DetailMovieBox = styled(motion.div)`
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    display: flex;
    width: 42vw;
    height: 75vh;
    margin: 0 auto;
    border-radius: 15px;
    background-color: ${(props) => props.theme.black.darker};
    overflow: hidden;
`;

const DetailMovieImg = styled.div<{ $photo: string }>`
    width: 60%;
    height: 100%;
    background: url(${(props) => props.$photo}) center/cover;
`;

const DetailMovieInfoWrapper = styled.div`
    width: 40%;
    height: 100%;
    padding: 25px 15px;
    word-break: keep-all;
    h2 {
        margin-bottom: 5px;
        font-size: 20px;
        font-weight: 600;
    }
    h3 {
        margin-bottom: 35px;
        font-size: 15px;
        font-weight: 600;
    }
    p {
        font-size: 14px;
    }
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

interface IMovieSliderProps {
    data: IGetMoviesResult;
    top: number;
}

function MovieSlider({ data, top }: IMovieSliderProps) {
    const [sliderPage, setSliderPage] = useState(0);
    const [sliderLeaving, setSliderLeaving] = useState(false);
    const sliderOffset = 6;

    const navigate = useNavigate();
    const detailMovieMatch = useMatch("/movies/:movieId");
    const clickedMovie =
        detailMovieMatch?.params.movieId &&
        data?.results.find((movie) => movie.id === Number(detailMovieMatch?.params.movieId));

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
            const maxIndex = Math.floor(totalMovies / sliderOffset) - 1;
            setSliderPage((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    /**@function toggleLeaving
     * 1. leaving(bool타입) 변수의 값을 반대 값으로 변경(true↔false)
     */
    const toggleLeaving = () => {
        setSliderLeaving((prev) => !prev);
    };

    /**@function onBoxClicked
     * 1. `/movies/${movieId}`경로로 이동
     */
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };

    /**@function onOverlayClick
     * 1. "/"경로로 이동
     */
    const onOverlayClick = () => {
        navigate("/");
    };

    return (
        <>
            <Slider $top={top}>
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
            {/* 임시 버튼, 수정 필요 */}
            <button
                onClick={increaseIndex}
                style={{
                    position: "absolute",
                    top: 450,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    width: "70px",
                    height: "50px",
                    margin: "0 auto",
                    backgroundColor: "red",
                }}
            >
                NEXT!!
            </button>
            <AnimatePresence>
                {detailMovieMatch ? (
                    <>
                        <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onOverlayClick} />
                        <DetailMovieBox layoutId={detailMovieMatch.params.movieId}>
                            {clickedMovie && (
                                <>
                                    <DetailMovieImg $photo={makeImagePath(clickedMovie.poster_path)} />
                                    <DetailMovieInfoWrapper>
                                        <h2>{clickedMovie.title}</h2>
                                        <h3>{clickedMovie.original_title}</h3>
                                        <p>{clickedMovie.overview}</p>
                                    </DetailMovieInfoWrapper>
                                </>
                            )}
                        </DetailMovieBox>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
}

export default MovieSlider;
