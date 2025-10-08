// src/components/admin/ProductsTable.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProductAsync,
  deleteProductAsync,
} from "../../redux/slices/admin/adminDashboardSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Typography,
  Paper,
  Divider,
  MenuItem,
  CircularProgress,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ProductsTable = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, error } = useSelector(
    (state) => state.adminDashboard
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [openAddConfirm, setOpenAddConfirm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
    images: [],
    previews: [],
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // --- Pagination ---
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- Category name helper ---
  const getCategoryName = (category) => {
    if (!category) return "N/A";
    if (typeof category === "object" && category.name) return category.name;
    const cat = categories.find((c) => c._id === category);
    return cat ? cat.name : "N/A";
  };

  // --- Image Change ---
  const handleImageChange = (e, isEdit = false) => {
    const files = e.target.files;
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    if (isEdit) setEditingProduct({ ...editingProduct, images: files, previews });
    else setNewProduct({ ...newProduct, images: files, previews });
  };

  // --- Validation ---
  const validateProduct = () => {
    const tempErrors = {};
    if (!newProduct.name.trim()) tempErrors.name = "Name is required";
    if (!newProduct.price || isNaN(newProduct.price) || newProduct.price <= 0)
      tempErrors.price = "Price must be a positive number";
    if (!newProduct.quantity || isNaN(newProduct.quantity) || newProduct.quantity < 0)
      tempErrors.quantity = "Quantity must be 0 or higher";
    if (!newProduct.category) tempErrors.category = "Category is required";
    if (!newProduct.images.length) tempErrors.images = "Image is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- Add Product ---
  const handleAddProduct = async () => {
    if (!validateProduct()) return;

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("quantity", newProduct.quantity);
    formData.append("description", newProduct.description);
    Array.from(newProduct.images).forEach((file) => formData.append("Photo", file));

    try {
      setUploading(true);
      await dispatch(
        createProduct({ productData: formData, categoryId: newProduct.category })
      ).unwrap();
      await dispatch(fetchProducts());
      setNewProduct({ name: "", price: "", quantity: "", description: "", category: "", images: [], previews: [] });
      setErrors({});
    } catch (err) {
      console.error("Add product error:", err);
    } finally {
      setUploading(false);
      setOpenAddConfirm(false);
    }
  };

  // --- Edit Product ---
  const handleOpenEdit = (product) => {
    setEditingProduct({ ...product, previews: product.Images || [] });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setEditingProduct(null);
    setOpenEdit(false);
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("price", editingProduct.price);
    formData.append("quantity", editingProduct.quantity);
    formData.append("description", editingProduct.description);
    if (editingProduct.images) {
      Array.from(editingProduct.images).forEach((file) => formData.append("Photo", file));
    }

    await dispatch(updateProductAsync({ productId: editingProduct._id, productData: formData })).unwrap();
    await dispatch(fetchProducts());
    handleCloseEdit();
  };

  // --- Delete Product ---
  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setProductToDelete(null);
    setOpenDelete(false);
  };
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProductAsync(productToDelete._id));
      await dispatch(fetchProducts());
    }
    handleCloseDelete();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Products Management</Typography>

      {/* Add Product Form */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}>Add New Product</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            label="Quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
          <TextField
            label="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            multiline
            rows={3}
          />
          <TextField
            select
            label="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            error={!!errors.category}
            helperText={errors.category}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" component="label">
            {uploading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload Image"}
            <input type="file" hidden multiple onChange={(e) => handleImageChange(e)} />
          </Button>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            {newProduct.previews?.map((src, idx) => <Avatar key={idx} src={src} sx={{ width: 56, height: 56 }} />)}
          </Stack>
          {errors.images && <Typography color="error">{errors.images}</Typography>}
          <Button variant="contained" color="primary" onClick={() => setOpenAddConfirm(true)}>
            Add Product
          </Button>
        </Box>
      </Paper>

      {/* Products Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, index) => (
              <TableRow key={p._id} sx={{ "&:hover": { backgroundColor: "#f5f7fa" } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{getCategoryName(p.category)}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenEdit(p)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleOpenDelete(p)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>

      {/* Edit Product Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Name" value={editingProduct?.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
          <TextField label="Price" value={editingProduct?.price || ""} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
          <TextField label="Quantity" value={editingProduct?.quantity || ""} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })} />
          <TextField label="Description" value={editingProduct?.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden multiple onChange={(e) => handleImageChange(e, true)} />
          </Button>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            {editingProduct?.previews?.map((src, idx) => <Avatar key={idx} src={src} sx={{ width: 56, height: 56 }} />)}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleUpdateProduct} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{productToDelete?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add Confirmation Dialog */}
      <Dialog open={openAddConfirm} onClose={() => setOpenAddConfirm(false)}>
        <DialogTitle>Confirm Add Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to add "{newProduct.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddConfirm(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} color="primary" variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsTable;
