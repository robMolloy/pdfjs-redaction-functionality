import { useState } from 'react';

export const CloseIconButton = (p: { onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <svg
      onClick={() => p.onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ background: isHovered ? '#00703c' : 'black', cursor: 'pointer' }}
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      height="45px"
      width="45px"
    >
      <path stroke="white" strokeWidth="3" d="M7.25,7.25,17.75,17.75" />
      <path stroke="white" strokeWidth="3" d="M7.25,17.75,17.75,7.25" />
    </svg>
  );
};
export const CloseIcon = () => {
  return (
    <svg
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      height="45px"
      width="45px"
    >
      <path stroke="white" strokeWidth="3" d="M7.25,7.25,17.75,17.75" />
      <path stroke="white" strokeWidth="3" d="M7.25,17.75,17.75,7.25" />
    </svg>
  );
};
