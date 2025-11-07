import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: fit-content;
`;
const ClearButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #d2d2d2;
  font-size: 12px;
  padding: 2px 8px;
`;

function DrawingCanvas({ width = 400, height = 240, onSave, initialImage }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.scale(scale, scale);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    if (initialImage) {
      const img = new Image();
      img.src = initialImage;
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      };
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }, [width, height, initialImage]);

  /* 터치/마우스 모두 지원하는 좌표 계산 함수 */
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();

    // 터치 이벤트인 경우
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    // 마우스 이벤트인 경우
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    isDrawing.current = false;
    onSave?.(canvasRef.current.toDataURL("image/png"));
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    onSave?.(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    //모바일 터치이벤트
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    return () => {
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
      canvas.removeEventListener("touchcancel", stopDrawing);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <canvas
        ref={canvasRef}
        style={{
          // background: "none",
          background: "#323232",
          borderRadius: "4px",
          border: "1px solid #666",
          touchAction: "none",
        }}
        // PC용 마우스 이벤트
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <ClearButton onClick={clearCanvas}>Clear</ClearButton>
    </Wrapper>
  );
}

export default DrawingCanvas;
