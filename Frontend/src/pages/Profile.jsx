// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Avatar,
//   Divider,
//   Grid,
//   Paper,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux"; 
// import { getProfile, logoutUser } from "../services/api";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const currentLang = useSelector((state) => state.myLang.lang);
//   const myContent = useSelector((state) => state.myLang.content);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const profile = await getProfile();
//         setUser(profile);
//       } catch (err) {
//         setError(err.message || myContent.profilePage.loadError);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [myContent.profilePage.loadError]);

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       navigate("/login");
//       window.location.reload();
//     } catch (err) {
//       console.error(err.message || myContent.profilePage.logoutFailed);
//     }
//   };

//   if (loading)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error)
//     return (
//       <Typography color="error" align="center" sx={{ mt: 5 }}>
//         {error}
//       </Typography>
//     );

//   if (!user)
//     return (
//       <Typography align="center" sx={{ mt: 5 }}>
//         {myContent.profilePage.userNotFound}
//       </Typography>
//     );

//   return (
//     <Box
//       sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}
//       dir={currentLang === "ar" ? "rtl" : "ltr"}
//     >
//       <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             mb: 4,
//             gap: 3,
//             flexDirection: currentLang === "ar" ? "row-reverse" : "row",
//           }}
//         >
//           <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: "#1976d2" }}>
//             {user.name?.charAt(0).toUpperCase()}
//           </Avatar>
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 700 }}>
//               {user.name}
//             </Typography>
//             <Typography variant="subtitle1" color="text.secondary">
//               @{user.username}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ mb: 4 }} />

//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" color="text.secondary">
//               {myContent.profilePage.email}
//             </Typography>
//             <Typography variant="body1">{user.email}</Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" color="text.secondary">
//               {myContent.profilePage.age}
//             </Typography>
//             <Typography variant="body1">{user.age || "-"}</Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" color="text.secondary">
//               {myContent.profilePage.createdAt}
//             </Typography>
//             <Typography variant="body1">
//               {new Date(user.createdAt).toLocaleDateString()}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" color="text.secondary">
//               {myContent.profilePage.status}
//             </Typography>
//             <Typography variant="body1">
//               {user.isConfirmed
//                 ? myContent.profilePage.confirmed
//                 : myContent.profilePage.unconfirmed}
//             </Typography>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 4 }} />

//         <Button variant="contained" color="error" fullWidth onClick={handleLogout}>
//           {myContent.profilePage.logout}
//         </Button>
//       </Paper>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProfile, logoutUser } from "../services/api";
import { logout } from "../redux/slices/authSlice"; // ✅ لتفريغ حالة المستخدم
import { clearWishlist } from "../redux/slices/wishlistSlice"; // ✅ لمسح الوش ليست من الذاكرة

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentLang = useSelector((state) => state.myLang.lang);
  const myContent = useSelector((state) => state.myLang.content);

  // 🧩 تحميل بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        setError(err.message || myContent.profilePage.loadError);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [myContent.profilePage.loadError]);

  // 🚪 تسجيل الخروج
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());          // 🧠 تفريغ بيانات المستخدم
      dispatch(clearWishlist());   // 🧹 مسح الوش ليست من الذاكرة فقط
      navigate("/login");          // 🔁 إعادة التوجيه بدون reload
    } catch (err) {
      console.error(err.message || myContent.profilePage.logoutFailed);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );

  if (!user)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        {myContent.profilePage.userNotFound}
      </Typography>
    );

  return (
    <Box
      sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            gap: 3,
            flexDirection: currentLang === "ar" ? "row-reverse" : "row",
          }}
        >
          <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: "#1976d2" }}>
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {myContent.profilePage.email}
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {myContent.profilePage.age}
            </Typography>
            <Typography variant="body1">{user.age || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {myContent.profilePage.createdAt}
            </Typography>
            <Typography variant="body1">
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {myContent.profilePage.status}
            </Typography>
            <Typography variant="body1">
              {user.isConfirmed
                ? myContent.profilePage.confirmed
                : myContent.profilePage.unconfirmed}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* 🚪 زرار تسجيل الخروج */}
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleLogout}
        >
          {myContent.profilePage.logout}
        </Button>
      </Paper>
    </Box>
  );
}
