import React from "react";
import styled from "styled-components";

import NodeBlock from "../ui/NodeBlock";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;  
const Bar = styled.div`
    width: 28px;
    height: 4px;
    border-radius: 2px;
    background: ${({ color }) => color || "#414141"}; /* Default color if none provided */
`;

const COLORS = {
    green: "#00A746",
    yellow: "#FFB800",
    red: "#FD4A52",
    blue: "#00A7EE",
};

function NodeColumn(props) {
    const { nodes, type } = props;

    return (
        <Wrapper>
            <Bar color={COLORS[type]} />
            {nodes?.map((n) => (
                <NodeBlock
                    key={n.id}   // index 대신 id
                    type={type}
                    id={n.id}    // id 전달
                    content={n.content}
                    image={n.image}
                />
            ))}
        </Wrapper>
    );
}


export default NodeColumn;