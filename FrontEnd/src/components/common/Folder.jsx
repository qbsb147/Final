import React from 'react';

const FolderIcon = (props) => (
  <svg width="34" height="32" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      opacity="0.3"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.75 24.75C6.75 25.5784 7.42157 26.25 8.25 26.25H30.25C31.0784 26.25 31.75 25.5784 31.75 24.75V10.25C31.75 9.42157 31.0784 8.75 30.25 8.75H16.75L13.4393 5.43934C13.158 5.15804 12.7765 5 12.3787 5H8.25C7.42157 5 6.75 5.67157 6.75 6.5V24.75Z"
      fill="black"
    />
    <g filter="url(#filter0_d_273_4823)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 22.25C4.25 23.0784 4.92157 23.75 5.75 23.75H27.75C28.5784 23.75 29.25 23.0784 29.25 22.25V7.75C29.25 6.92157 28.5784 6.25 27.75 6.25H14.25L10.9393 2.93934C10.658 2.65804 10.2765 2.5 9.87868 2.5H5.75C4.92157 2.5 4.25 3.17157 4.25 4V22.25Z"
        fill="#FAD700"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_273_4823"
        x="0.25"
        y="2.5"
        width="33"
        height="29.25"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_273_4823" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_273_4823" result="shape" />
      </filter>
    </defs>
  </svg>
);

export default FolderIcon;
