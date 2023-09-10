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
    gap: 10px;
    width: 100%;
`;

const Box = styled(motion.div)`
    height: 200px;
    background-color: white;
    color: red;
    font-size: 66px;
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth + 10,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 10,
    },
};

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    /**@function increaseIndex
     * 1. Row의 Animation이 실행 중이면 아무것도 return하지않음
     * 2. 실행 중이 아니면 leaving(bool타입) 변수의 값을 true로 변경하고
     * 3. sliderIndex 변수의 값을 +1
     */
    const increaseIndex = () => {
        if (leaving) return;
        setLeaving(true);
        setSliderIndex((prev) => prev + 1);
    };

    /**@function toggleLeaving
     * 1. leaving(bool타입) 변수의 값을 반대 값으로 변경(true↔false)
     */
    const toggleLeaving = () => {
        setLeaving((prev) => !prev);
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
                                key={sliderIndex}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                            >
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <Box key={item}>{item}</Box>
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
