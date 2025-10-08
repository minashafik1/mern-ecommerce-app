import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarts, removeCart } from "../../redux/slices/admin/adminCartSlice";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Typography, Paper, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Avatar
} from "@mui/material";

const CartTable = () => {
  const dispatch = useDispatch();
  const { carts = [], loading, error } = useSelector((state) => state.adminCart || {});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCart, setSelectedCart] = useState(null);
  const [cartToDelete, setCartToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCarts());
  }, [dispatch]);

  // Open delete confirmation dialog
  const handleDeleteClick = (cart) => {
    setCartToDelete(cart);
  };

  const handleConfirmDelete = () => {
    if (cartToDelete) {
      dispatch(removeCart(cartToDelete._id));
      setCartToDelete(null);
    }
  };

  const handleCancelDelete = () => setCartToDelete(null);

  const handleViewDetails = (cart) => setSelectedCart(cart);
  const handleCloseDetails = () => setSelectedCart(null);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Carts List</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">No carts found</TableCell>
            </TableRow>
          ) : (
            carts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cart, index) => (
                <TableRow key={cart._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{cart.user?.name || "Unknown"}</TableCell>
                  <TableCell>${cart.totalCartPrice?.toFixed(2) || 0}</TableCell>
                  <TableCell>{new Date(cart.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleViewDetails(cart)}>
                      View
                    </Button>
                    <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteClick(cart)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={carts.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      {/* View Details Modal */}
      <Dialog open={!!selectedCart} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Cart Details - {selectedCart?.user?.name}</DialogTitle>
        <DialogContent dividers>
          {selectedCart?.cartItems?.length > 0 ? (
            <Grid container spacing={2}>
              {selectedCart.cartItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      variant="square"
                      src={item.product.Images?.[0]}
                      alt={item.product.name}
                      sx={{ width: 60, height: 60 }}
                    />
                    <div>
                      <Typography variant="subtitle2">{item.product.name}</Typography>
                      <Typography variant="body2">Qty: {item.quantity}</Typography>
                      <Typography variant="body2">Price: ${item.price}</Typography>
                      <Typography variant="body2">Total: ${item.price * item.quantity}</Typography>
                    </div>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No items in this cart</Typography>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>Total: ${selectedCart?.totalCartPrice?.toFixed(2)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!cartToDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the cart of "{cartToDelete?.user?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CartTable;
