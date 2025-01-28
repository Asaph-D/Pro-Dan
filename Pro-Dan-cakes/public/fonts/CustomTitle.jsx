import React from 'react';

const CustomTitle = () => {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Cut Putroe Navisha';
          src: url('/fonts/CutPutroeNavisha.ttf') format('truetype');
        }

        .custom-title {
          font-family: 'Cut Putroe Navisha', cursive;
          color: #e55d22;
          font-size: 3.5rem;
          text-align: center;
          margin: 1rem 0;
          line-height: 1.2;
          font-weight: normal;
        }
      `}</style>
      <h1 className="custom-title">Pro Dan Cakes</h1>
    </>
  );
};

export default CustomTitle;