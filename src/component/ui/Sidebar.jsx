import React, { useContext } from "react";
import styled from "styled-components";
import { NodeContext } from "../page/MainPage";

import NodeColumn from '../list/NodeColumn';

const Wrapper = styled.div`
    //background-color: #3C3C3C;
    //box-sizing: border-box;
    //height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 40px;
    padding: 20px;
    min-height: calc(100vh - 160px); /* 헤더, 패딩 제외 */
`;
const NodeBoard = styled.div`
    width: 172px;
    height: 100%;
    // max-height: 600px;
    // min-height: 432px;
    display: flex;
    gap: 20px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
const StyledButton = styled.button`
    width: 172px;
    background-color: #FFF;
    color: #2C2C2C;
    opacity: 0.5;
    border: none;
    padding: 8px 20px;
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
const StyledButton2 = styled(StyledButton)`
    border: 1px solid #fff;
    color: #fff;
    background: none;
    &:hover {
        border: 1px solid #FFF;
        background-color: #3c3c3c;

        color: #fff;
    }
`;

const NODE_TYPES = ["green", "yellow", "red", "blue"];


function Sidebar(props) {
    const { nodes, setIsLinkMode, isLinkMode, setSelectedNode, isIdeaMode, setIsIdeaMode, setSelectedLink } = useContext(NodeContext); // Access isLinkMode from context

    const handleButtonClick = () => {
        setIsLinkMode((prevMode) => !prevMode);
        setSelectedNode(null);
         // Toggle between modes
        // console.log("isLinkMode updated to:", !isLinkMode); // Debugging log
    };

    const handleButtonClick2 = () => {
        setIsIdeaMode((prevMode) => !prevMode);
        setSelectedLink(null);
        // Toggle between modes
    };

    return (
        <Wrapper>
            <NodeBoard>
                {NODE_TYPES.map(type => (
                    <NodeColumn
                    key={type}
                    type={type}
                    nodes={nodes[type]}
                    />
                ))}
            </NodeBoard>
            <ButtonContainer>
                {!isIdeaMode && (
                    <StyledButton onClick={handleButtonClick}>
                        {isLinkMode ? "Add Node" : "Link Node"}
                    </StyledButton>
                )}
                
                <StyledButton2 onClick={handleButtonClick2}>
                    {isIdeaMode ? "Close" : "View Ideas"}
                </StyledButton2>
            </ButtonContainer>
        </Wrapper>
    );
}

export default Sidebar;