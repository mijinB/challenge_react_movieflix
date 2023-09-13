import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import { makeImagePath } from "../utils";
import { IGetTvResult, ITv } from "../api";

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
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10px;
    background-image: linear-gradient(rgba(20, 20, 20, 0), rgba(20, 20, 20, 1));
    opacity: 0;
    color: ${(props) => props.theme.white.darker};
    text-align: center;
    font-weight: 600;
    span {
        margin-bottom: 5px;
        font-size: 11px;
        font-weight: 400;
    }
    h2 {
        font-size: 14px;
    }
    h3 {
        font-size: 11px;
    }
`;

const BoxNextButton = styled.button<{ $buttonTop: number }>`
    position: absolute;
    top: ${(props) => props.$buttonTop}px;
    right: 0;
    z-index: 1;
    margin: 0 auto;
    padding: 67px 50px;
    border: none;
    background: none;
    opacity: 0.7;
    color: ${(props) => props.theme.white.lighter};
    font-size: 50px;
    cursor: pointer;
    &:hover {
        color: ${(props) => props.theme.red};
    }
`;

const NoImg = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.black.veryDark};
    color: ${(props) => props.theme.white.darker};
    text-align: center;
    font-weight: 600;
    h2 {
        font-size: 20px;
    }
    h3 {
        font-size: 14px;
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const DetailTvBox = styled(motion.div)<{ $photo: string }>`
    position: fixed;
    z-index: 2;
    top: 100px;
    left: 0;
    right: 0;
    display: flex;
    width: 42vw;
    height: 75vh;
    margin: 0 auto;
    border-radius: 15px;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${(props) => props.$photo}) center/cover;
    overflow: hidden;
`;

const DetailTvImg = styled.div<{ $photo: string }>`
    width: 60%;
    height: 100%;
    background: url(${(props) => props.$photo}) center/cover;
`;

const DetailTvInfoWrapper = styled.div`
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
        margin-bottom: 20px;
        font-size: 17px;
        font-weight: 600;
    }
    p {
        font-size: 16px;
        line-height: 1.4;
    }
`;

const SmallInfoWrapper = styled.div`
    p:first-child {
        font-size: 12px;
    }
    p:last-child {
        margin-bottom: 30px;
        font-size: 14px;
        font-weight: 600;
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
        scale: 1.5,
        transition: {
            type: "tween",
            delay: 0.5,
            duration: 0.5,
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

interface ITvSliderProps {
    section: string;
    keyPlus: string;
    data: IGetTvResult;
    top: number;
    buttonTop: number;
}

function TvSlider({ section, keyPlus, data, top, buttonTop }: ITvSliderProps) {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");

    const [sliderPage, setSliderPage] = useState(0);
    const [sliderLeaving, setSliderLeaving] = useState(false);
    const sliderOffset = 6;

    const [clickedTv, setClickedTv] = useState<ITv>();
    const navigate = useNavigate();
    const detailTvMatch = useMatch("/tv/:tvId");
    const searchTvMatch = useMatch("/search/:tvId");

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

            const totalTvs = data.results.length;
            const maxIndex = Math.floor(totalTvs / sliderOffset) - 1;
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
     * 1. `/${section}/${tvId}`경로로 이동 (Search화면이면 "?keyword={keyword}추가")
     * 2. clickedTv state 변수를 클릭한 tv로 저장
     */
    const onBoxClicked = (tv: ITv) => {
        navigate(`/${section}/${tv.id}${keyword ? "?keyword=" + keyword : ""}`);
        setClickedTv(tv);
    };

    /**@function onOverlayClick
     * 1. "/${section}"경로로 이동 (Search화면이면 "?keyword={keyword}추가")
     */
    const onOverlayClick = () => {
        navigate(`/${section}${keyword ? "?keyword=" + keyword : ""}`);
        setClickedTv(undefined);
    };

    return (
        <>
            <Slider $top={top}>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        key={`${keyPlus}_${sliderPage}`}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                    >
                        {data?.results
                            .slice(sliderOffset * sliderPage, sliderOffset * sliderPage + sliderOffset)
                            .map((tv) => (
                                <Box
                                    layoutId={`${keyPlus}_${tv.id}`}
                                    key={`${keyPlus}_${tv.id}`}
                                    variants={boxVariants}
                                    initial="normal"
                                    whileHover="hover"
                                    transition={{ type: "tween" }}
                                    onClick={() => onBoxClicked(tv)}
                                >
                                    {tv.backdrop_path || tv.poster_path ? (
                                        <BoxImg $photo={makeImagePath(tv.backdrop_path ?? tv.poster_path, "w500")} />
                                    ) : (
                                        <NoImg>
                                            <h2>{tv.name}</h2>
                                            <h3>{tv.original_name}</h3>
                                        </NoImg>
                                    )}
                                    <BoxInfo variants={boxInfoVariants}>
                                        <span>{`⭐${tv.vote_average}/10`}</span>
                                        <h2>{tv.name}</h2>
                                        <h3>{tv.original_name}</h3>
                                    </BoxInfo>
                                </Box>
                            ))}
                    </Row>
                </AnimatePresence>
            </Slider>
            <BoxNextButton $buttonTop={buttonTop} onClick={increaseIndex}>
                ▶
            </BoxNextButton>
            <AnimatePresence>
                {(detailTvMatch || searchTvMatch) && clickedTv ? (
                    <>
                        <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onOverlayClick} />
                        <DetailTvBox
                            layoutId={
                                detailTvMatch
                                    ? `${keyPlus}_${detailTvMatch?.params.tvId}`
                                    : `${keyPlus}_${searchTvMatch?.params.tvId}`
                            }
                            $photo={makeImagePath(clickedTv.backdrop_path)}
                        >
                            {clickedTv && (
                                <>
                                    <DetailTvImg $photo={makeImagePath(clickedTv.poster_path)} />
                                    <DetailTvInfoWrapper>
                                        <h2>{clickedTv.name}</h2>
                                        <h3>{clickedTv.original_name}</h3>
                                        <SmallInfoWrapper>
                                            <p>{`첫 방영일 : ${clickedTv.first_air_date}`}</p>
                                            <p>{`⭐${clickedTv.vote_average}/10 (total ${clickedTv.vote_count})`}</p>
                                        </SmallInfoWrapper>
                                        <p>{clickedTv.overview}</p>
                                    </DetailTvInfoWrapper>
                                </>
                            )}
                        </DetailTvBox>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
}

export default React.memo(TvSlider);
