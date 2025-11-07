import React, { useState, createContext, useEffect } from "react";
import styled from "styled-components";

import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import ContentAddNode from '../ui/ContentAddNode';
import ContentLinkNode from '../ui/ContentLinkNode';
import ContentIdeas from '../ui/ContentIdeas';

export const NodeContext = createContext();

const Wrapper = styled.div`
    background-color: #2C2C2C;
    width: 100vw;
    min-width: 1028px;
    height: 100vh;
    min-height: 820px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 40px;
    padding: 40px;
`;


function MainPage(props) {

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ""; 
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    


    const [nodes, setNodes] = useState({
        //여기 타입에 색상은 왜 또 쓴거지......
        green: [
            { id: 1, type: "green", content: "사용자는 복잡한 케이블이나 부피 큰 장치를 벗어나, 운동 중에도 편리하게 치료 가능" },
            { id: 5, type: "green", content: "낙상 감지와 활동 모니터링을 통해 사용자의 안전과 안심을 보장한다." }
        ],
        yellow: [
            { id: 2, type: "yellow", content: "인체 곡면에 안정적으로 밀착되고, 부착/탈착이 쉬운 구조 필요." },
            { id: 6, type: "yellow", content: "법적·윤리적으로 영상·음성 데이터 수집이 제한된 환경(가정, 요양시설 등)에서도 작동해야 한다." }
        ],
        red: [
            { id: 3, type: "red", content: "중앙 손잡이가 있는 타원형 하우징 → 직관적 한손 조작 지원", 
                image: "data:image/png;base64,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"
             },
            { id: 7, type: "red", content: "생활공간에 자연스럽게 녹아드는 기하학적·비가시적 형태로 설계되어, 존재감 없이 보호의 의미를 시각적으로 전달한다.",
                image: "data:image/png;base64,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"
             }
        ],
        blue: [
            { id: 4, type: "blue", content: "TENS/EMS 무선 자극 기술, 자기 도킹 기반 무선 충전, 일체형 조작·충전 유닛" },
            { id: 8, type: "blue", content: "mmWave(밀리미터파) 레이더와 AI 신호처리를 이용해 97% 이상의 정확도로 움직임과 낙상을 탐지한다." }],
    });


    const [selectedNode, setSelectedNode] = useState(null); // 선택된 노드
    const [selectedLink, setSelectedLink] = useState({
        green: null,
        yellow: null,
        red: null,
        blue: null
    });

    const [isLinkMode, setIsLinkMode] = useState(false); // Track mode

    const [linkedTitle, setLinkedTitle] = useState(null);
    const [linkedSubtitle, setLinkedSubtitle] = useState(null);
    const [linkedContent, setLinkedContent] = useState(null);
    const [linkedFeatures, setLinkedFeatures] = useState(null);


    const [savedIdea, setSavedIdea] = useState([
          {
            id: 1,
            title: "Wireless TENS Pro",
            subtitle: "Touch of Relief",
            content: "Wireless TENS Pro는 TENS(경피신경자극)와 EMS(근육자극) 기능을 결합한 휴대용 무선 치료기이다.",
            features: "- 전극과 본체의 완전한 무선 연결 및 자기 도킹 충전으로 이동성 극대화\n- 중앙 손잡이와 실리콘 그립존으로 한 손 조작과 미끄럼 방지 구현\n- 컬러 디스플레이와 아이콘 내비게이션으로 직관적 제어 제공",
            greenId: 1,  
            yellowId: 2, 
            redId: 3,   
            blueId: 4,   
        },
        {
            id: 2,
            title: "Wireless Safety System That Sees Without Seeing — Protecting Privacy While Detecting Falls",
            subtitle: "Invisible Geometry of Care",
            content: "밀리미터파 레이더와 AI 기반의 비시각적 센서 시스템으로, 카메라나 착용형 기기 없이 사용자의 움직임을 97% 이상의 정확도로 감지한다. 눈에 띄지 않는 기하학적 형태로 설계되어 가정이나 병원 등 민감한 공간에도 자연스럽게 설치되며, 낙상이나 이상 움직임 발생 시 즉각적으로 알람을 제공한다.",
            features: "- mmWave 레이더 기반의 비시각적 감지 기술로 프라이버시 보호 \n- 30도 코너 설치로 시야각을 극대화한 공간 효율적 구조 \n- AI 신호처리를 통한 97% 이상의 정확도와 오탐지 최소화",
            greenId: 5, 
            yellowId: 6, 
            redId: 7,   
            blueId: 8, 
        },
    ]); // 저장된 아이디어 목록

    const [isIdeaMode, setIsIdeaMode] = useState(false); // Track mode

    // useEffect(() => {
    //     console.log("Current nodes:", nodes); // Log nodes whenever they change
    // }, [nodes]);


    const addNode = (newNode) => {
        const nodeWithId = {
            ...newNode,
            id: Date.now(), // timestamp 기반 고유 id
        };

        setNodes((prevNodes) => ({
            ...prevNodes,
            [newNode.type]: [...(prevNodes[newNode.type] || []), nodeWithId],
        }));
    };

    const updateNode = (type, id, newContent, newImage = null) => {
        setNodes((prev) => ({
            ...prev,
            [type]: prev[type].map((n) =>
            n.id === id
                ? {
                    ...n,
                    content: newContent,
                    image: newImage !== undefined ? newImage : n.image, 
                }
                : n
            ),
        }));
    };


    const deleteNode = (type, id) => {
        //현재 아이디어 목록 확인
        const isUsed = savedIdea?.some((idea) => idea?.[`${type}Id`] === id);

        if (isUsed) {
            alert(`이 ${type} 노드는 이미 아이디어에 사용 중이라 삭제할 수 없습니다.`);
            return;
        }

        //사용되지 않은 경우에만 삭제
        setNodes((prev) => ({
            ...prev,
            [type]: prev[type].filter((n) => n.id !== id),
        }));
    };


    useEffect(() => {
        setSelectedLink((prev) => {
            if (!prev) return prev;

            // ✅ shallow copy만 하고 내부 노드만 교체
            const updated = { ...prev };
            let changed = false;

            for (const [type, node] of Object.entries(prev)) {
                if (!node?.id) continue;

                const currentList = nodes[type];
                if (!currentList) continue;

                const updatedNode = currentList.find((n) => n.id === node.id);
                if (updatedNode && updatedNode.content !== node.content) {
                    updated[type] = { ...node, content: updatedNode.content }; 
                    changed = true;
                }
            }

            return changed ? updated : prev; // 변경사항이 없으면 이전 객체 그대로 반환 → 리렌더 최소화
        });

        setSavedIdea((prev) =>
            prev.map((idea) => {
                const updatedIdea = { ...idea };
                let modified = false;

                ["green", "yellow", "red", "blue"].forEach((type) => {
                    const updatedNode = nodes[type]?.find((n) => n.id === idea[`${type}Id`]);
                    if (updatedNode && updatedNode.content !== idea[type]) {
                        updatedIdea[type] = updatedNode.content;
                        modified = true;
                    }
                });

                return modified ? updatedIdea : idea;
            })
        );
    }, [nodes]);



    return (   
        <NodeContext.Provider value=
            {{ 
                nodes, addNode, updateNode, deleteNode, 
                selectedNode, setSelectedNode, selectedLink, setSelectedLink, 
                linkedTitle, setLinkedTitle, linkedSubtitle, setLinkedSubtitle,  linkedContent, setLinkedContent,linkedFeatures, setLinkedFeatures,
                isLinkMode, setIsLinkMode, isIdeaMode, setIsIdeaMode, savedIdea, setSavedIdea 
            }}>
            <Wrapper>
                <Header />
                <Container>
                    <Sidebar />
                    {isIdeaMode ? <ContentIdeas /> : (isLinkMode ? <ContentLinkNode /> : <ContentAddNode />)}
                </Container>

            </Wrapper>
        </NodeContext.Provider>
    );
}

export default MainPage;

