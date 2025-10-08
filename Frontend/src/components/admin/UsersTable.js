import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/admin/adminDashboardSlice";

const UsersTable = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state) => state.adminDashboard
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Fetch users once on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
        Loading users...
      </Typography>
    );
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        Error: {error}
      </Typography>
    );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: "bold",
          textAlign: "center",
          color: "#1976d2",
        }}
      >
        Users List
      </Typography>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white" }}>#</TableCell>
              <TableCell sx={{ color: "white" }}>Username</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || "User"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={users?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default UsersTable;
