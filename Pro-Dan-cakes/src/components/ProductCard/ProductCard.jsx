import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ title, description, imageSrc }) => (
  <div className={styles.card}>
    <div className={styles.imageContainer}>
      <img src={imageSrc} alt={title} />
    </div>
    <div className={styles.content}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default ProductCard;
// import React from 'react';

// const ProductCard = ({ title, description, imageSrc }) => {
//     return (
//         <div className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden group" style={{ backgroundImage: `url(${imageSrc})`, height: '300px' }}>
//             <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition duration-300"></div>
//             <div className="relative z-10 p-4 text-white flex flex-col justify-between h-full">
//                 <h3 className="text-xl font-bold mb-2">{title}</h3>
//                 <p className="text-lg font-medium">{description}</p>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;
