import React, { useContext } from "react";
import styled from "styled-components";
import { NodeContext } from "../page/MainPage";

const COLORS = {
  green: "#00A746",
  yellow: "#FFB800",
  red: "#FD4A52",
  blue: "#00A7EE",
};

const Wrapper = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 2px;
  background: ${({ isActive, type }) => (isActive ? COLORS[type] : "#444")};
  cursor: pointer;
`;

function NodeBlock(props) {
  const { type, content, id, image } = props;
  const {
    setSelectedNode,
    selectedNode,
    selectedLink,
    setSelectedLink,
    isLinkMode,
    isIdeaMode,
  } = useContext(NodeContext);

  const handleClick = () => {
    if (isLinkMode || isIdeaMode) {
      // 링크 모드
      const alreadyActive = selectedLink?.[type]?.id === id;

      if (alreadyActive) {
        setSelectedLink((prev) => ({
          ...prev,
          [type]: null,
        }));
      } else {
        setSelectedLink((prev) => ({
          ...prev,
          [type]: { type, id, content, image },
        }));
      }
    } else {
      // 일반 모드
      const alreadyActive =
        selectedNode?.type === type && selectedNode?.id === id;

      if (alreadyActive) {
        setSelectedNode(null);
      } else {
        setSelectedNode({ type, id, content, image });
      }
    }
  };

  // --- 색상 표시 로직 ---
  let isActive = false;
  if (isLinkMode || isIdeaMode) {
    isActive = selectedLink?.[type]?.id === id;
  } else {
    isActive = selectedNode?.type === type && selectedNode?.id === id;
  }

  return <Wrapper type={type} isActive={isActive} onClick={handleClick} />;
}

export default NodeBlock;
