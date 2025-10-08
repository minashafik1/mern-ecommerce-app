// import React from 'react';
// import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();

//   // Responsive breakpoints
//   const isXs = useMediaQuery(theme.breakpoints.down('sm'));
//   const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//   const handleShopNow = () => {
//     navigate('/products');
//   };

//   return (
//     <Box
//       sx={{
//         height: '100vh',
//         width: '100%',
//         background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/momswhosell.jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         px: 2, // Padding for mobile
//       }}
//     >
//       <Button
//         variant="contained"
//         color="error"
//         onClick={handleShopNow}
//         sx={{
//           padding: isXs ? '12px 24px' : isSm ? '14px 28px' : '15px 30px',
//           fontSize: isXs ? '1rem' : isSm ? '1.1rem' : '1.2rem',
//           borderRadius: 2,
//           boxShadow: 3,
//         }}
//       >
//         Shop Now
//       </Button>
//     </Box>
//   );
// };

// export default Home;

import React from "react";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // 🟩 تم الإضافة: علشان نجيب اللغة من الـ Redux

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // 🟩 جلب اللغة والمحتوى المترجم من الـ Redux
  const currentLang = useSelector((state) => state.myLang.lang);
  const myContent = useSelector((state) => state.myLang.content);

  // Responsive breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleShopNow = () => {
    navigate("/products");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        direction: currentLang === "ar" ? "rtl" : "ltr", // 🟩 تم الإضافة: اتجاه الصفحة حسب اللغة
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/momswhosell.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2, // Padding for mobile
      }}
    >
      <Button
        variant="contained"
        color="error"
        onClick={handleShopNow}
        sx={{
          padding: isXs ? "12px 24px" : isSm ? "14px 28px" : "15px 30px",
          fontSize: isXs ? "1rem" : isSm ? "1.1rem" : "1.2rem",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {myContent.shopNow} {/* 🟩 تم التعديل: بدل النص الثابت */}
      </Button>
    </Box>
  );
};

export default Home;
