import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ApiKeyContext } from "../../ApiKeyContext";

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;
const ModalBox = styled.div`
  color: #fff;
  padding: 28px;
  border-radius: 4px;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 12px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
  color: #fff;
`;
const Button = styled.button`
  padding: 6px 12px;
  background: #2C2C2C;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

function ApiKeyModal({ onClose }) {
  const { updateApiKey } = useContext(ApiKeyContext);
  const [key, setKey] = useState("");

  const handleSave = () => {
    if (key.trim() === "") return;
    updateApiKey(key);
    onClose();
    alert("API Key saved successfully!");
  };

  return (
    <Wrapper>
      <ModalBox>
        <h3>API Key</h3>
        <Input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your API Key"
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </ModalBox>
    </Wrapper>
  );
}

export default ApiKeyModal;
