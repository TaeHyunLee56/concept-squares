import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { NodeContext } from "../page/MainPage";
import { ApiKeyContext } from "../../ApiKeyContext";
import DrawingCanvas from "./DrawingCanvas";

const NODE_DATA = {
    green: { text: "Value", color: "#00A746" },
    yellow: { text: "Constraint", color: "#FFB800" },
    red: { text: "Representation", color: "#FD4A52" },
    blue: { text: "Technology", color: "#00A7EE" },
};

const Wrapper = styled.div`
    background-color: #323232;
    width: 100%;
    height: 100%;
    padding: 60px;
    position: relative;
`;

const Title = styled.h2`
    color: #FFF;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 60px;
    background: none;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: none;
`;

const SelectNodeContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 20px;
    background: none;
`;

const Node = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 2px;
    background-color: ${({ color }) => color};
    opacity: ${({ isSelected }) => (isSelected ? 1 : 0.3)};
    cursor: pointer;
    transition: opacity 0.2s ease;
`;

const StyledP = styled.p`
    color: #FFF;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 40px;
    background: none;
`;

const StyledTextarea = styled.textarea`
    border: none;
    background: none;
    color: #FFF;
    font-size: 16px;
    outline: none;
    resize: none;
    overflow: auto;
    width: 100%;
    height: 240px;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const GenerateBtn = styled.p`
    position: absolute;
    bottom: 60px;
    left: 60px;
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

const SmallButton = styled.button`
  color: #d2d2d2;
  font-size: 14px;
  padding: 2px 8px;
  opacity: 0.5;
`;
const StyledButton2 = styled.button`
    position: absolute;
    bottom: 60px;
    right: 60px;
    background-color: #FFF;
    color: #2C2C2C;
    opacity: 0.6;
    border: 2px solid #FFF;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
        background-color: #2C2C2C;
        color: #FFF;
    }
`;

const StyledButton3 = styled(StyledButton2)`
    right: 140px;
    background-color: #323232;
    color: #fff;
    opacity: 0.3;
    border: 1px solid #323232;
`;

function ContentAddNode() {
    const { nodes, addNode, updateNode, deleteNode, selectedNode, setSelectedNode } = useContext(NodeContext);
    const { apiKey } = useContext(ApiKeyContext);

    const [selectedType, setSelectedType] = useState("green");
    const [textContent, setTextContent] = useState("");
    const [drawingData, setDrawingData] = useState(null);
    const [generatedText, setGeneratedText] = useState(null);
    const [loadingType, setLoadingType] = useState(null);

    useEffect(() => {
        if (selectedNode) {
            setSelectedType(selectedNode.type);
            setTextContent(selectedNode.content || "");
            setDrawingData(selectedNode.image || null);
        } else {
            setSelectedType("green");
            setTextContent("");
            setDrawingData(null);
        }
    }, [selectedNode]);

    const getPrompt = (type, nodes) => {
        const NODE_LABELS = {
            green: "Value (가치)",
            yellow: "Constraint (제약)",
            red: "Representation (표현)",
            blue: "Technology (기술)"
        };

        // 현재 저장된 모든 노드 요약
        const existingNodes = Object.entries(nodes || {})
            .map(([key, arr]) => {
            if (Array.isArray(arr) && arr.length > 0) {
                return arr.map(node => `- ${NODE_LABELS[key]}: "${node.content}"`).join("\n");
            }
            return `- ${NODE_LABELS[key]}: (아직 없음)`;
            })
            .join("\n");

        const typeSpecificRules = {
            green: `- 다른 노드 맥락을 함께 고려하며 “이 디자인이 왜 의미 있는가?”에 대해 작성`,
            yellow: `- 다른 노드 맥락을 함께 고려하며 “이 디자인이 어떤 조건과 한계 속에서 작동해야 하는가?”에 대해 작성.`,
            red: `- 다른 노드 맥락을 함께 고려하며 “이 디자인은 어떤 모습으로 구현되는 것이 적절한가?”에 대해 작성.`,
            blue: `- 다른 노드 맥락을 함께 고려하며 “이 디자인에는 어떤 기술이 적용될 수 있는가?”에 대해 작성.`
        }[type];

        // 최종 프롬프트
        return `
            현재 시스템에는 다음과 같은 노드들이 존재합니다:
            ${existingNodes}

            이제 새로운 **${NODE_LABELS[type]}** 노드를 생성해야 합니다.  
            이 노드는 기존 노드들과 **의미적으로 조화되면서도 새로운 관점**을 제시해야 합니다.
            ${typeSpecificRules}
            추상적인 표현을 사용하지 않고 명료하게 작성해야 합니다.

            출력은 다음 JSON 형식으로, **한국어로** 작성하세요:
            {
            "type": "${NODE_LABELS[type]}",
            "nodeContents": "새로운 노드의 핵심 내용",
            }
        `;
    };

    // Generate 요청 (독립형 노드용)
    async function ask() {
        if (!apiKey) {
            alert("API Key is missing.");
            return;
        }

        const systemPrompt = `
            당신은 디자인의 네 가지 속성을 기반으로 창의적이고 논리적인 아이디어 노드를 생성하는 전문가입니다.

            - 각 노드는 하나의 디자인 속성을 나타냅니다.
            - 노드는 서로 직접 연결되지 않더라도, 의미적으로 균형을 이뤄야 합니다.
            - 표현은 구체적이고 직관적으로, 일반 사용자가 이해할 수 있도록 작성하세요.

            ### 속성별 의미
            - **Value (가치)**: Properties of value regarding personal, social, functional and symbolic aspects. 
            - **Constraint (제약)**: Properties that are imposed by an external body or identified by a design team.
            - **Representation (표현)**: Properties of visual, semantic and behavioral aspects of the concept
            - **Technology (기술)**: Properties of the technology used by the concept that are intrinsic (e.g. new digital parts included) or extrinsic (e.g. manufactuing technology).
        `;

        const userPrompt = getPrompt(selectedType, nodes);
        // console.log("🧠 Generated User Prompt:", userPrompt);

        try {
            setLoadingType(selectedType);
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

            // 결과 표시
            setGeneratedText(parsed.nodeContents);
            // console.log("Parsed Node JSON:", parsed);
        } catch (err) {
            // console.error(err);
            alert("Error generating node.");
        } finally {
            setLoadingType(null);
        }
    }

    const handleApplyGenerated = () => {
        setTextContent(generatedText);
        setGeneratedText(null);
    };

    const handleCancelGenerated = () => {
        setGeneratedText(null);
    };

    // 저장 로직 동일
    const handleSave = () => {
        if (generatedText && textContent !== generatedText) {
            alert("Please apply or cancel the generated text before saving.");
            return;
        }
        if (!textContent) return;

        if (selectedNode) {
            updateNode(
                selectedNode.type,
                selectedNode.id,
                textContent,
                selectedNode.type === "red" ? drawingData || null : undefined
            );
            setSelectedNode(null);
        } else {
            addNode({
                type: selectedType,
                content: textContent,
                image: selectedType === "red" ? drawingData || null : undefined,
            });
        }
        setTextContent("");
        setDrawingData(null);
    };

    return (
        <Wrapper>
            <Title>{selectedNode ? "Edit Node" : "Add Node"}</Title>
            <ContentContainer>
                <SelectNodeContainer>
                    {Object.entries(NODE_DATA).map(([nodeName, nodeData]) => (
                        <Node
                            key={nodeName}
                            color={nodeData.color}
                            isSelected={selectedType === nodeName}
                            onClick={() => setSelectedType(nodeName)}
                        />
                    ))}
                </SelectNodeContainer>

                <StyledP>{NODE_DATA[selectedType]?.text || ""}</StyledP>

                <div style={{ display: "flex", flexDirection: "row", gap: "40px", background: "none" }}>
                    <StyledTextarea
                        placeholder="Type your node content here..."
                        value={generatedText || textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                    />
                    {selectedType === "red" && (
                        <DrawingCanvas
                            key={selectedNode?.id || "new"}
                            width={400}
                            height={240}
                            initialImage={drawingData}
                            onSave={(img) => setDrawingData(img)}
                        />
                    )}
                </div>
            </ContentContainer>

            {loadingType ? (
                <p style={{ position: "absolute", bottom: 60, left: 60, opacity: 0.5, color: "#fff" }}>Generating...</p>
            ) : generatedText ? (
                <div style={{ position: "absolute", bottom: 60, left: 60, display: "flex", gap: "8px", background: "none" }}>
                    <SmallButton onClick={handleCancelGenerated}>cancel</SmallButton>
                    <SmallButton onClick={handleApplyGenerated}>apply</SmallButton>
                </div>
            ) : (
                <GenerateBtn onClick={ask}>Generate</GenerateBtn>
            )}

            <StyledButton2 onClick={handleSave}>
                {selectedNode ? "Update" : "Save"}
            </StyledButton2>
            {selectedNode && (
                <StyledButton3
                    onClick={() => {
                        deleteNode(selectedNode.type, selectedNode.id);
                        setSelectedNode(null);
                    }}
                >
                    Delete
                </StyledButton3>
            )}
        </Wrapper>
    );
}

export default ContentAddNode;

