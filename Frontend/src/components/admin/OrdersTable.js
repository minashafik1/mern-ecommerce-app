import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  changeOrderStatus,
  removeOrder,
} from "../../redux/slices/admin/adminOrderSlice";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Paper,
  TablePagination,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogActions,
  Chip,
  Tooltip,
  Box,
  Collapse,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

// Confirmation dialog
const ConfirmDialog = ({ open, title, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm} color="error">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

// Status colors
const statusColors = {
  pending: "warning",
  confirmed: "success",
  shipped: "info",
  completed: "primary",
  cancelled: "error",
};

// Format date to "YYYY-MM-DD HH:mm"
const formatDate = (dateString) => {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// Row component with expandable products
const OrderRow = ({ order, index, page, rowsPerPage, openStatusDialog, openDeleteDialog }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
        <TableCell>{order.userId?.name || "Unknown"}</TableCell>
        <TableCell>{order.userId?.email || "N/A"}</TableCell>
        <TableCell>${order.totalPrice?.toFixed(2) || 0}</TableCell>
        <TableCell>{order.paymentMethod || "N/A"}</TableCell>
        <TableCell>
          <Select
            value={order.orderStatus || "pending"}
            size="small"
            onChange={(e) => openStatusDialog(order._id, e.target.value)}
            sx={{ minWidth: 110 }}
          >
            {Object.keys(statusColors).map((status) => (
              <MenuItem key={status} value={status}>
                <Chip
                  label={status}
                  color={statusColors[status]}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              </MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell>{formatDate(order.createdAt)}</TableCell>
        <TableCell>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => openDeleteDialog(order._id)}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} sx={{ p: 0, borderBottom: "none" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper
              elevation={1}
              sx={{ m: 1, p: 2, borderRadius: 2, backgroundColor: "#fafafa" }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Products in this order:
              </Typography>
              <Stack spacing={1}>
                {order.products.map((p) => (
                  <Box
                    key={p._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: "#fff",
                      boxShadow: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {p.name}
                      </Typography>
                      <Typography variant="caption">
                        Quantity: {p.quantity} | Price: ${p.productPrice} | Final: ${p.finalPrice}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OrdersTable = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector(
    (state) => state.adminOrder || {}
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const openDeleteDialog = (orderId) => {
    setSelectedAction({ type: "delete", orderId });
    setDialogOpen(true);
  };

  const openStatusDialog = (orderId, status) => {
    setSelectedAction({ type: "status", orderId, status });
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (selectedAction.type === "delete") {
      dispatch(removeOrder(selectedAction.orderId));
    } else if (selectedAction.type === "status") {
      dispatch(
        changeOrderStatus({
          orderId: selectedAction.orderId,
          status: selectedAction.status,
        })
      );
    }
    setDialogOpen(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Orders Dashboard
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order, index) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  index={index}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  openStatusDialog={openStatusDialog}
                  openDeleteDialog={openDeleteDialog}
                />
              ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <ConfirmDialog
        open={dialogOpen}
        title={
          selectedAction.type === "delete"
            ? "Are you sure you want to delete this order?"
            : `Are you sure you want to change status to "${selectedAction.status}"?`
        }
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </Paper>
  );
};

export default OrdersTable;
