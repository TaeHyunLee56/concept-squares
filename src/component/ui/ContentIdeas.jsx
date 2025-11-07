import React, { useState, useContext, useMemo } from "react";
import styled from "styled-components";
import { NodeContext } from "../page/MainPage";
import ContentEditIdea from "./ContentEditIdea";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
  color: #fff;
  background-color: #323232;
  width: 100%;
  height: calc(100vh - 160px);
  overflow-y: auto;
`;

const IdeaCard = styled.div`
  background: none;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  height: 380px;
  transition: all 0.3s ease;
  &:hover {
    background: #2c2c2c;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: none;
`;

const IdeaTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  background: none;
  height: 36px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const IdeaContent = styled.p`
  font-size: 14px;
  background: none;
  max-height: 80px;
  opacity: 0.8;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

/* ✅ 이미지 유무에 따라 background 변경 */
const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 4px;
  background: ${({ $image }) =>
    $image
      ? `url(${$image}) center center / contain no-repeat, #2c2c2c`
      : "#2c2c2c"};
  transition: background 0.3s ease;
`;

function ContentIdeas() {
  const { nodes, savedIdea, selectedLink, setSelectedLink } =
    useContext(NodeContext);
  const [selectedIdea, setSelectedIdea] = useState(null);

  const handleIdeaClick = (idea) => {
    const newLink = {
      green: idea.greenId
        ? {
            id: idea.greenId,
            content:
              nodes.green.find((node) => node.id === idea.greenId)?.content ||
              "",
          }
        : null,
      yellow: idea.yellowId
        ? {
            id: idea.yellowId,
            content:
              nodes.yellow.find((node) => node.id === idea.yellowId)?.content ||
              "",
          }
        : null,
      red: idea.redId
        ? {
            id: idea.redId,
            content:
              nodes.red.find((node) => node.id === idea.redId)?.content || "",
            image:
              nodes.red.find((node) => node.id === idea.redId)?.image || null,
          }
        : null,
      blue: idea.blueId
        ? {
            id: idea.blueId,
            content:
              nodes.blue.find((node) => node.id === idea.blueId)?.content || "",
          }
        : null,
    };

    setSelectedLink(newLink);
    setSelectedIdea(idea);
  };

  const activeSelections = useMemo(
    () =>
      Object.entries(selectedLink || {}).filter(
        ([, node]) => node && node.id
      ),
    [selectedLink]
  );

  const filteredIdeas = useMemo(() => {
    if (!Array.isArray(savedIdea)) return [];
    if (activeSelections.length === 0) return savedIdea;

    return savedIdea.filter((idea) =>
      activeSelections.every(
        ([type, node]) => idea?.[`${type}Id`] === node.id
      )
    );
  }, [savedIdea, activeSelections]);

  return selectedIdea ? (
    <ContentEditIdea idea={selectedIdea} setSelectedIdea={setSelectedIdea} />
  ) : (
    <Wrapper>
      {filteredIdeas.length > 0 ? (
        filteredIdeas.map((idea) => {
          const redNode = nodes.red.find((node) => node.id === idea.redId);
          const image = redNode?.image || null;

          return (
            <IdeaCard key={idea.id} onClick={() => handleIdeaClick(idea)}>
              <TextContainer>
                <IdeaTitle>{idea.title}</IdeaTitle>
                <IdeaContent>{idea.content}</IdeaContent>
              </TextContainer>

              <ImageContainer $image={image} />
            </IdeaCard>
          );
        })
      ) : (
        <p style={{ background: "none", opacity: 0.5 }}>
          No ideas match selected nodes ...
        </p>
      )}
    </Wrapper>
  );
}

export default ContentIdeas;
