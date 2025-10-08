import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategoriesAsync,
  createCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync,
} from "../../redux/slices/admin/adminCategorySlice";
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
  DialogActions,
  TextField,
  Paper,
  Typography,
} from "@mui/material";

const CategoriesTable = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.adminCategory);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [newCategory, setNewCategory] = useState({ name: "" });

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  // Pagination
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // CRUD Handlers
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    dispatch(createCategoryAsync(newCategory));
    setNewCategory({ name: "" });
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setEditingCategory(null);
    setOpenEdit(false);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory.name.trim()) return;
    dispatch(updateCategoryAsync({ categoryId: editingCategory._id, categoryData: editingCategory }));
    handleCloseEdit();
  };

  // DELETE
  const handleOpenDelete = (category) => {
    setCategoryToDelete(category);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setCategoryToDelete(null);
    setOpenDelete(false);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategoryAsync(categoryToDelete._id));
    }
    handleCloseDelete();
  };

  if (loading) return <Typography>Loading categories...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Categories Management</Typography>

      {/* Add Category */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <TextField
          label="New Category"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ name: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddCategory}>
          Add
        </Button>
      </div>

      {/* Categories Table */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((c, index) => (
              <TableRow key={c._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell align="center">
                  <Button size="small" onClick={() => handleOpenEdit(c)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleOpenDelete(c)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={categories.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={editingCategory?.name || ""}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleUpdateCategory} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{categoryToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoriesTable;
