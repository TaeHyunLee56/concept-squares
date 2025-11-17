import React, { useState, useContext } from "react";
import styled from "styled-components";
import ApiKeyModal from "./ApiKeyModal";
import { NodeContext } from "../page/MainPage";

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
`;
const HeaderTitle = styled.h1`
  color: #FFF;
  font-size: 16px;
  cursor: pointer;
`;

function Header() {
      const { setIsLinkMode, setIsIdeaMode } = useContext(NodeContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Wrapper>
        <HeaderTitle onClick={()=>{setIsIdeaMode(false); setIsLinkMode(false);}} >Concept-Squares</HeaderTitle>
        <img
          src={process.env.PUBLIC_URL + "/icons/key.png"}
          width="24px"
          style={{ cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
          alt="API Key"
        />
      </Wrapper>

      {isModalOpen && <ApiKeyModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default Header;
