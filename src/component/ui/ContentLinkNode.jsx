import React, { useState, useContext } from "react";
import styled, { keyframes, css } from "styled-components";
import { NodeContext } from "../page/MainPage";
import { ApiKeyContext } from "../../ApiKeyContext";


const NODE_DATA = {
    green: { text: "Value", color: "#00A746" },
    yellow: { text: "Constraint", color: "#FFB800" },
    red: { text: "Representation", color: "#FD4A52" },
    blue: { text: "Technology", color: "#00A7EE" },
};
const NODE_POSITIONS = [
    "top: 0; left: 0;",
    "top: 0; right: 0;",
    "bottom: 0; left: 0;",
    "bottom: 0; right: 0;",
];
const arrowPositions = [
    { bottom: "20px", right: "20px", transform: "rotate(0deg)" }, // 위 → 아래(중앙 향함)
    { left: "20px", bottom: "20px", transform: "rotate(90deg)" }, // 오른쪽 → 왼쪽
    { top: "20px", right: "20px", transform: "rotate(270deg)" }, // 아래 → 위
    { left: "20px", top: "20px", transform: "rotate(180deg)" }, // 왼쪽 → 오른쪽
];


const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #2C2C2C;
`;
const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 0 40px 0 10px;
`;
const Title = styled.h2`
    color: #FFF;
    font-size: 14px;
    font-weight: 600;
`;
const StyledButton = styled.button`
    background-color: #FFF;
    color: #2C2C2C;
    opacity: 0.6;
    border: 2px solid #2c2c2c;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
        background-color: #2C2C2C;
        color: #FFF;
        border: 2px solid #FFF;
    }
`;
const ContentContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 20px;
    height: 100%;
    position: relative;
    margin: 40px 40px 20px 10px;
    min-width: 800px;
`;
const Contents = styled.div`
    background-color: #323232;
    color: #fff;  
    padding: 32px;  
    font-size: 14px;
    ${({ hidden }) => hidden && css`display: none;`}
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
    min-height: 268px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    ${({ image }) =>
        image &&
        css`
            background-image: url(${image});
        `}
`;
const ContentsText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    p:first-child { font-weight: 600; }
    background: none;
`;
const TypeText = styled.p`
    overflow: scroll;
    background: none;
    border-radius: 4px;
    padding: 8px;
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
    max-height: 140px;
`;
const GenerateBtnContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: none;
`;
const GenerateBtn = styled.p`
    box-sizing: border-box;
    color: #FFF;
    opacity: 0.5;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
        opacity: 0.8;
        text-decoration: underline;
    }
    width: fit-content;
`;
const ContentCenter = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #323232;
    color: #fff;
    width: ${({ expanded }) => expanded ? "84%" : "48px"};
    height: ${({ expanded }) => expanded ? "84%" : "48px"};
    z-index: 2;
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 32px;
`;
const NodeIcon = styled.div`
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background-color: ${({ color }) => color};
    ${({ position }) => position};
`;
const CornerBox = styled.div`
    position: absolute;
    width: calc(8% + 12px);
    height: calc(8% + 12px);
    background-color: #323232;
    ${({ position }) => position};
`;
const StyledTextarea = styled.textarea`
    border: none;
    background: none;
    color: #FFF;
    font-size: 15px;
    outline: none;
    resize: none;
    overflow: auto;
    &::-webkit-scrollbar { display: none; }
`;
const StyledTextarea2 = styled(StyledTextarea)`
    min-height: 80px;
`;
const TextareaContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: none;
`;
const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: none;
`;
const StyledP = styled.p`
    color: #FFF;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.5;
    background: none;
`;
const SmallButton = styled.button`
  color: #d2d2d2;
  font-size: 12px;
  padding: 2px 8px;
  opacity: 0.5;
`;
const pulse = keyframes`
  0% { opacity: 0.1; }
  50% { opacity: 0.4; }
  100% { opacity: 0.1; }
`;

const Arrow1 = styled.img`
  user-select: none;
  width: 28px;
  height: 28px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* 펼쳐진 상태면 안 보임 */
  opacity: ${({ expanded }) => (expanded ? 0 : 0.8)};

  /* 접혀있을 때만 투명도 반복 애니메이션 */
  ${({ expanded }) =>
    !expanded &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
    `}
`;
const Arrow2 = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  cursor: pointer;
  transition: transform 0.25s ease;

  ${({ index }) => arrowPositions[index]}

  ${css`
      animation: ${pulse} 2s ease-in-out infinite;
    `}
`;


function ContentLinkNode() {
    const { 
        selectedLink, setSelectedLink, 
        setLinkedTitle, setLinkedSubtitle, setLinkedContent, setLinkedFeatures,
        linkedTitle, linkedSubtitle, linkedContent, linkedFeatures,
        setSavedIdea, addNode, updateNode
    } = useContext(NodeContext);
    const { apiKey } = useContext(ApiKeyContext);

    const [expanded, setExpanded] = useState(false);
    const [generatedText, setGeneratedText] = useState(null);
    const [loadingType, setLoadingType] = useState(null);





    const getPrompt = (type, selectedLink, linkedTitle, linkedSubtitle, linkedContent, linkedFeatures) => {
        const NODE_KEYS = {
            green: "Value (가치)",
            yellow: "Constraint (제약)",
            red: "Representation (표현)",
            blue: "Technology (기술)"
        };

        // 통합 JSON 맥락 구성
        const contextData = {
            ideaContext: {
            title: linkedTitle || "아직 정해지지 않음",
            subtitle: linkedSubtitle || "아직 정해지지 않음",
            description: linkedContent || "아직 정해지지 않음",
            keyFeatures: linkedFeatures || "아직 정해지지 않음"
            },
            linkedNodes: Object.entries(NODE_KEYS).reduce((acc, [key, label]) => {
            acc[label] = selectedLink?.[key]?.content || "아직 생성되지 않음";
            return acc;
            }, {})
        };

        const typeSpecificRules = {
            green: `- 다른 노드와 아이디어 맥락을 함께 고려하며 “이 디자인이 왜 의미 있는가?”에 대해 작성`,
            yellow: `- 다른 노드와 아이디어 맥락을 함께 고려하며 “이 디자인에는 어떤 조건과 한계가 있을 수 있는가?”에 대해 작성.`,
            red: `- 다른 노드와 아이디어 맥락을 함께 고려하며 “이 디자인은 어떤 모습으로 구현되는 것이 적절한가?”에 대해 작성.`,
            blue: `- 다른 노드와 아이디어 맥락을 함께 고려하며 “이 디자인에는 어떤 기술이 적용될 수 있는가?”에 대해 작성.`
        }[type];

        return `
            아래 JSON은 현재 아이디어와 연결된 노드의 상태를 보여준다.
            ${JSON.stringify(contextData, null, 2)}
                            
                            
            이를 참고하여 새로운 **${NODE_KEYS[type]}** 노드를 생성한다.
            이 노드는 기존 노드들과 의미적으로 조화되면서도 새로운 관점을 제시해야 합니다.
            ${typeSpecificRules}


            출력은 다음 형식의 JSON으로 **한국어로** 작성한다:
            {
                "type": "${NODE_KEYS[type]}",
                "nodeContents": "새로운 노드의 핵심 내용",
            }
        `;
    };

    async function ask(type) {
        if (!apiKey) {
            alert("API Key is missing.");
            return;
        }

        const systemPrompt = `
            당신은 Linked Node Design Model을 기반으로 아이디어 속성의 **harmonious integration** 을 이끄는 역할을 맡고 있습니다.

            ### Linked Node Design Model 개요
            - LNDM은 디자인 개념을 구성하는 네 가지 속성(Value, Constraint, Representation, Technology)으로 이루어져 있습니다.
            - 각 노드(node)는 아이디어의 속성(property)을 의미하며, 링크(link)는 속성 간의 의미적 관계를 나타냅니다.
            - 디자인은 문제→해결의 선형 과정이 아니라, 속성 간의 비선형적 탐색과 조합 과정입니다.
            - 좋은 디자인은 네 속성이 상호보완적으로 연결되어 조화로운 결과물을 만들 때 실현됩니다.

            ### 속성별 의미
            - **Value (가치)**: Properties of value regarding personal, social, functional and symbolic aspects. 
            - **Constraint (제약)**: Properties that are imposed by an external body or identified by a design team.
            - **Representation (표현)**: Properties of visual, semantic and behavioral aspects of the concept
            - **Technology (기술)**: Properties of the technology used by the concept that are intrinsic (e.g. new digital parts included) or extrinsic (e.g. manufactuing technology).
        `;

        const userPrompt = getPrompt(
            type,
            selectedLink,
            linkedTitle,
            linkedSubtitle,
            linkedContent,
            linkedFeatures
        );

        // console.log("System Prompt:", systemPrompt);
        // console.log("User Prompt:", userPrompt);

        try {
            setLoadingType(type);
            setGeneratedText(null);

            const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
                ],
            }),
            });

            const data = await res.json();
            const parsed = JSON.parse(data.choices[0].message.content);

            setGeneratedText({
            type,
            text: parsed.nodeContents,
            reason: parsed.reason,
            });

            // console.log("Parsed JSON:", parsed);
        } catch (err) {
            // console.error(err);
            alert("Error generating JSON response.");
        } finally {
            setLoadingType(null);
        }
    }

    const getExpandedPrompt = (selectedLink, linkedTitle, linkedSubtitle, linkedContent, linkedFeatures) => {
        const NODE_KEYS = {
            green: "Value",
            yellow: "Constraint",
            red: "Representation",
            blue: "Technology"
        };

        // 통합 JSON 맥락 (하나의 객체로 깔끔하게)
        const contextData = {
            ideaContext: {
                title: linkedTitle || "아직 정해지지 않음",
                subtitle: linkedSubtitle || "아직 정해지지 않음",
                description: linkedContent || "아직 정해지지 않음",
                keyFeatures: linkedFeatures || "아직 정해지지 않음"
            },
            linkedNodes: Object.entries(NODE_KEYS).reduce((acc, [key, label]) => {
                acc[label] = selectedLink?.[key]?.content || "아직 생성되지 않음";
                return acc;
            }, {})
        };

        // 비어있는 필드만 필터링
        const emptyFields = [];
        if (!linkedTitle) emptyFields.push("title");
        if (!linkedSubtitle) emptyFields.push("subtitle");
        if (!linkedContent) emptyFields.push("description");
        if (!linkedFeatures) emptyFields.push("keyFeatures");

        // 비어있는 필드만 출력 예시에 포함
        const exampleJSON = emptyFields.length > 0
            ? "{\n" +
            emptyFields.map((field) => {
                switch (field) {
                    case "title":
                        return `  "title": "Title illustrating the solution and the problem"`;
                    case "subtitle":
                        return `  "subtitle": "An abstract symbolic title"`;
                    case "description":
                        return `  "description": "A summary of what the thing is"`;
                    case "keyFeatures":
                        return `  "keyFeatures": "Three key features which make the design concept unique and outstanding. dot points와 \n 사용하여 줄바꿈"`;
                    default:
                        return "";
                }
            }).join(",\n") +
            "\n}"
            : "{\n  // 모든 필드가 이미 작성되어 있습니다.\n}";

        // 프롬프트 본문
        return `
            아래는 JSON은 현재 아이디어와 연결된 노드의 상태를 보여준다.
            ${JSON.stringify(contextData, null, 2)}
                            
                            
            이를 참고하여 아이디어의 핵심 컨셉
            (Title, Subtitle, Description, Key  Features)을 완성한다.
            - 이미 작성된 필드는 유지하고, 비어 있는 필드만 새로 채운다.
            - 4가지 속성이 조화를 이룰 수 있는 아이디어를 제시한다.
            
            
            출력은 다음 JSON 형식으로 **한국어로** 작성한다:
            ${exampleJSON}
        `;
    };

    async function askExpanded() {
        if (!apiKey) {
            alert("API Key is missing.");
            return;
        }

        // 비어있는 필드 감지
        const emptyFields = [];
        if (!linkedTitle) emptyFields.push("title");
        if (!linkedSubtitle) emptyFields.push("subtitle");
        if (!linkedContent) emptyFields.push("description");
        if (!linkedFeatures) emptyFields.push("keyFeatures");

        // 모든 필드가 작성되어 있으면 요청 자체 중단
        if (emptyFields.length === 0) {
            alert("이미 모든 필드가 작성되어 있습니다. 생성 요청을 중단합니다.");
            return;
        }

        // System Prompt
        const systemPrompt = `
            당신은 Linked Node Design Model을 기반으로 아이디어 속성의 **harmonious integration** 을 이끄는 역할을 맡고 있습니다.


            ### Linked Node Design Model 개요
            - LNDM은 디자인 개념을 구성하는 네 가지 속성(Value, Constraint, Representation, Technology)으로 이루어져 있습니다.
            - 각 노드(node)는 아이디어의 속성(property)을 의미하며, 링크(link)는 속성 간의 의미적 관계를 나타냅니다.
            - 디자인은 문제→해결의 선형 과정이 아니라, 속성 간의 비선형적 탐색과 조합 과정입니다.
            - 좋은 디자인은 네 속성이 상호보완적으로 연결되어 조화로운 결과물을 만들 때 실현됩니다.


            ### 속성별 의미
            - **Value (가치)**: Properties of value regarding personal, social, functional and symbolic aspects. 
            - **Constraint (제약)**: Properties that are imposed by an external body or identified by a design team.
            - **Representation (표현)**: Properties of visual, semantic and behavioral aspects of the concept
            - **Technology (기술)**: Properties of the technology used by the concept that are intrinsic (e.g. new digital parts included) or extrinsic (e.g. manufactuing technology).
        `;


        // User Prompt (비어 있는 필드만 예시로 표시됨)
        const userPrompt = getExpandedPrompt(
            selectedLink,
            linkedTitle,
            linkedSubtitle,
            linkedContent,
            linkedFeatures
        );

        // console.log("Expanded System Prompt:", systemPrompt);
        // console.log("Expanded User Prompt:", userPrompt);

        try {
            setLoadingType("expanded");
            setGeneratedText(null);

            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                }),
            });

            const data = await res.json();
            const parsed = JSON.parse(data.choices[0].message.content);

            // 비어있는 필드만 업데이트
            if (emptyFields.includes("title") && parsed.title) setLinkedTitle(parsed.title);
            if (emptyFields.includes("subtitle") && parsed.subtitle) setLinkedSubtitle(parsed.subtitle);
            if (emptyFields.includes("description") && parsed.description) setLinkedContent(parsed.description);
            if (emptyFields.includes("keyFeatures") && parsed.keyFeatures) setLinkedFeatures(parsed.keyFeatures);

            // console.log("Parsed Expanded JSON:", parsed);
        } catch (err) {
            // console.error(err);
            alert("Error generating expanded content.");
        } finally {
            setLoadingType(null);
        }
    }


    // 기존 handleSaveIdea / handleAcceptGenerated 그대로 유지
    const handleSaveIdea = () => {
        if (!linkedTitle || !linkedSubtitle || !linkedContent) {
            alert("Please fill in all required fields: Title, SubTitle, Description.");
            return;
        }
        const missingTypes = Object.entries(NODE_DATA).filter(([type]) => !selectedLink?.[type]?.content);
        if (missingTypes.length > 0) {
            alert(`Please fill in all required types: ${missingTypes.map(([type]) => NODE_DATA[type].text).join(", ")}`);
            return;
        }

        const newIdea = {
            id: Date.now(),
            title: linkedTitle,
            subtitle: linkedSubtitle,
            content: linkedContent,
            features: linkedFeatures,
            greenId: selectedLink?.green?.id || null,
            yellowId: selectedLink?.yellow?.id || null,
            redId: selectedLink?.red?.id || null,
            blueId: selectedLink?.blue?.id || null,
        };

        setSavedIdea((prev) => [...prev, newIdea]);
        alert("Saved!");
        setSelectedLink(null);
        setLinkedTitle(null);
        setLinkedSubtitle(null);
        setLinkedContent(null);
        setLinkedFeatures(null);
        setExpanded(false);
    };

    const handleAcceptGenerated = () => {
        if (!generatedText) return;
        const { type, text } = generatedText;
        if (selectedLink?.[type]) {
            updateNode(type, selectedLink[type].id, text, undefined);
            setSelectedLink((prev) => ({
                ...prev,
                [type]: { ...prev[type], content: text },
            }));
        } else {
            const newNode = { type, content: text, id: Date.now() };
            addNode(newNode);
            setSelectedLink((prev) => ({
                ...prev,
                [type]: newNode,
            }));
        }
        setGeneratedText(null);
    };
  return (
        <Wrapper>
            <TitleContainer>
                <Title>Link Node</Title>
                <StyledButton onClick={handleSaveIdea}>Save</StyledButton>
            </TitleContainer>

            <ContentContainer>
                {!expanded &&
                Object.entries(NODE_DATA).map(([type, d], i) => (
                    <Contents key={i} image={selectedLink?.[type]?.image}>
                        <ContentsText>
                            <p style={{ background: "none" }}>{d.text}</p>
                            <TypeText>
                            {generatedText?.type === type
                                ? generatedText.text // 새로 생성된 텍스트가 있으면 미리보기로 표시
                                : selectedLink?.[type]?.content || ""}
                            </TypeText>
                        </ContentsText>

                        {/* {type !== "red" && ( */}
                            <GenerateBtnContainer>
                                {loadingType === type ? (
                                    <p style={{ opacity: 0.5 }}>Generating...</p>
                                ) : (
                                    <GenerateBtn onClick={() => ask(type)}>Generate</GenerateBtn>
                                )}

                                {generatedText?.type === type && !loadingType && (
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <SmallButton onClick={() => setGeneratedText(null)}>cancel</SmallButton>
                                        <SmallButton onClick={handleAcceptGenerated}>apply</SmallButton>
                                    </div>
                                )}
                            </GenerateBtnContainer>
                        {/* )} */}
                    </Contents>
                ))
                }

                {expanded &&
                    NODE_POSITIONS.map((pos, i) => (
                        <CornerBox key={i} position={pos} onClick={() => setExpanded(false)}>
                            <Arrow2 src="/icons/arrow2.png" alt="Collapse Icon" index={i}/>
                         </CornerBox>
                    ))
                }

                <ContentCenter expanded={expanded} onClick={() => setExpanded(true)}>
                    {Object.entries(NODE_DATA).map(([key, { color }], index) => (
                        <NodeIcon key={key} color={color} position={NODE_POSITIONS[index]} />
                    ))}

                    <Arrow1 src="/icons/arrow1.png" alt="Expand Icon" expanded={expanded} />

                    {expanded ? (
                        <>
                            <TextareaContainer>
                                <StyledDiv>
                                    <StyledP>Title</StyledP>
                                    <StyledTextarea
                                        placeholder="Illustrating the solution and the problem"
                                        value={linkedTitle || ""}
                                        onChange={(e) => setLinkedTitle(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </StyledDiv>
                                <StyledDiv>
                                    <StyledP>SubTitle</StyledP>
                                    <StyledTextarea
                                        placeholder="An abstract symbolic title"
                                        value={linkedSubtitle || ""}
                                        onChange={(e) => setLinkedSubtitle(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </StyledDiv>
                                <StyledDiv>
                                    <StyledP>Description</StyledP>
                                    <StyledTextarea2
                                        placeholder="A summary of what the concept is"
                                        value={linkedContent || ""}
                                        onChange={(e) => setLinkedContent(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </StyledDiv>
                                <StyledDiv>
                                    <StyledP>Key Features</StyledP>
                                    <StyledTextarea2
                                        placeholder="Three key features which make the design concept unique and outstanding"
                                        value={linkedFeatures || ""}
                                        onChange={(e) => setLinkedFeatures(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </StyledDiv>
                            </TextareaContainer>

                            {loadingType === "expanded" ? (
                                <p  style={{ background:"none", opacity: 0.5 }}>Generating...</p>
                            ) : (
                                <GenerateBtn 
                                onClick={(e) => { e.stopPropagation(); askExpanded(); }}
                                >
                                    Generate
                                </GenerateBtn>
                            )}
                        </>
                    ) : null}
                </ContentCenter>
            </ContentContainer>
        </Wrapper>
    );
}

export default ContentLinkNode;