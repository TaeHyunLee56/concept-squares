import React, { useState, useContext, useEffect } from "react";
import styled, { css } from "styled-components";
import { NodeContext } from "../page/MainPage";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background-color: #2C2C2C; color: #FFF; }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  height: 100%;
  position: relative;
  margin: 40px 40px 20px 10px;
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
  background: none;
  p:first-child { font-weight: 600; }
`;

const TypeText = styled.p`
  overflow: scroll;
  background: none;
  max-height: 140px;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ContentCenter = styled.div`
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  background: #323232; color: #fff;
  width: ${({ expanded }) => expanded ? "80%" : "48px"};
  height: ${({ expanded }) => expanded ? "80%" : "48px"};
  z-index: 2;
  transition: all 0.4s ease;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 32px;
`;

const NodeIcon = styled.div`
  position: absolute;
  width: 12px; height: 12px; border-radius: 2px;
  background-color: ${({ color }) => color};
  ${({ position }) => position};
`;

const CornerBox = styled.div`
  position: absolute;
  width: calc(10% + 12px);
  height: calc(10% + 12px);
  background-color: #323232;
  ${({ position }) => position};
`;

const StyledTextarea = styled.textarea`
  border: none; background: none; color: #FFF;
  font-size: 15px; outline: none; resize: none; overflow: auto;
  &::-webkit-scrollbar { display: none; }
`;
const StyledTextarea2 = styled(StyledTextarea)`
  min-height: 80px;
`;

const TextareaContainer = styled.div`
  display: flex; flex-direction: column; gap: 8px; background: none;
`;

const StyledDiv = styled.div`
  display: flex; flex-direction: column; gap: 12px; background: none;
`;

const StyledP = styled.p`
  color: #FFF; font-size: 14px; font-weight: 600; opacity: 0.5; background: none;
`;

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

function ContentEditIdea({ idea, setSelectedIdea }) {
const { setSavedIdea, selectedLink, setSelectedLink, nodes } = useContext(NodeContext);

  // Expanded / 생성 상태
  const [expanded, setExpanded] = useState(false);

  // 아이디어 편집 상태 // context랑 변수 네이밍이 겹치네
  const [linkedTitle, setLinkedTitle] = useState("");
  const [linkedSubtitle, setLinkedSubtitle] = useState("");
  const [linkedContent, setLinkedContent] = useState("");
  const [linkedFeatures, setLinkedFeatures] = useState("");

  // 아이디어의 노드 텍스트(아이디어 스냅샷 기준으로만 수정)
  const [, setNodeTexts] = useState({
    green: "", yellow: "", red: "", blue: ""
  });
  // (선택) 이미지가 있었다면 유지
  const [, setImages] = useState({
    red: idea?.redImage || null,
  });

  // 초기값 로드
  useEffect(() => {
    if (!idea) return;
    setLinkedTitle(idea.title || "");
    setLinkedSubtitle(idea.subtitle || "");
    setLinkedContent(idea.content || "");
    setLinkedFeatures(idea.features || "");
    setNodeTexts({
      green: nodes.green.find((node) => node.id === idea.greenId)?.content || "",
      yellow: nodes.yellow.find((node) => node.id === idea.yellowId)?.content || "",
      red: nodes.red.find((node) => node.id === idea.redId)?.content || "",
      blue: nodes.blue.find((node) => node.id === idea.blueId)?.content || "",
    });
    setImages((prev) => ({ ...prev, red: idea.redImage || prev.red || null }));
  }, [idea, nodes]);

  // 선택된 노드가 바뀔 때 nodeTexts 자동 반영
  useEffect(() => {
    if (!selectedLink) return;

    setNodeTexts((prev) => {
      const updated = { ...prev };
      for (const [type, node] of Object.entries(selectedLink)) {
        if (node?.content) {
          updated[type] = node.content; // 실시간 동기화
        }
      }
      return updated;
    });
  }, [selectedLink]);

  // --- 업데이트 (아이디어 배열에서 해당 아이템 교체) ---
const handleUpdateIdea = () => {
  if (!linkedTitle || !linkedSubtitle || !linkedContent) {
    alert("Please fill in all required fields: Title, SubTitle, Description.");
    return;
  }

  setSavedIdea((prev) =>
    prev.map((i) =>
      i.id === idea.id
        ? {
            ...i,
            // 기본 필드 업데이트
            title: linkedTitle,
            subtitle: linkedSubtitle,
            content: linkedContent,
            features: linkedFeatures,

            // 노드 정보 갱신 (선택된 노드 기준)
            greenId: selectedLink?.green?.id || null,
            yellowId: selectedLink?.yellow?.id || null,
            redId: selectedLink?.red?.id || null,
            blueId: selectedLink?.blue?.id || null,
          }
        : i
    )
  );

  alert("Updated!");
  setSelectedIdea(null); // 리스트로 복귀
};

  return (
    <Wrapper>
      <TitleContainer>
        <div style={{display: "flex", flexDirection: "row", gap: "8px", alignItems: "center"}}> 
          <img src={process.env.PUBLIC_URL + "/icons/back.png"} alt="back" width="20px" onClick={() => {setSelectedIdea(null); setSelectedLink(null);}} />
          <Title>Edit Idea</Title>
        </div>
        <StyledButton onClick={handleUpdateIdea}>Update</StyledButton>
      </TitleContainer>

      <ContentContainer>
        {/* --- 좌우/상하 4칸: 노드 보기 + Generate --- */}
                {!expanded &&
                Object.entries(NODE_DATA).map(([type, d], i) => (
                    <Contents key={i} image={selectedLink?.[type]?.image}>
                        <ContentsText>
                            <p style={{ background: "none" }}>{d.text}</p>
                            <TypeText>
                                {selectedLink?.[type]?.content || ""}
                            </TypeText>
                        </ContentsText>

                    </Contents>
          ))
        }

        {expanded &&
          NODE_POSITIONS.map((pos, i) => (
            <CornerBox key={i} position={pos} onClick={() => setExpanded(false)} />
          ))
        }
        <ContentCenter expanded={expanded} onClick={() => setExpanded(true)}>
          {Object.entries(NODE_DATA).map(([key, { color }], index) => (
            <NodeIcon key={key} color={color} position={NODE_POSITIONS[index]} />
          ))}

          {expanded ? (
            <>
              <TextareaContainer>
                <StyledDiv>
                  <StyledP>Title</StyledP>
                  <StyledTextarea
                    placeholder="Illustrating the solution and the problem"
                    value={linkedTitle}
                    onChange={(e) => setLinkedTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </StyledDiv>

                <StyledDiv>
                  <StyledP>SubTitle</StyledP>
                  <StyledTextarea
                    placeholder="An abstract symbolic title"
                    value={linkedSubtitle}
                    onChange={(e) => setLinkedSubtitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </StyledDiv>

                <StyledDiv>
                  <StyledP>Description</StyledP>
                  <StyledTextarea2
                    placeholder="3 Key features"
                    value={linkedContent}
                    onChange={(e) => setLinkedContent(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </StyledDiv>
                <StyledDiv>
                  <StyledP>Key Features</StyledP>
                  <StyledTextarea2
                    placeholder="3 Key features"
                    value={linkedFeatures}
                    onChange={(e) => setLinkedFeatures(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </StyledDiv>
              </TextareaContainer>
            </>
          ) : null}
        </ContentCenter>
      </ContentContainer>
    </Wrapper>
  );
}


export default ContentEditIdea;
