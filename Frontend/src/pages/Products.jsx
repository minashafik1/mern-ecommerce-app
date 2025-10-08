import React, { useEffect, useState } from "react";
import ProductList from "../components/Product/ProductList";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesAsync,
  searchProductsAsync,
  fetchProductsAsync,
  setSearchResults,
} from "../redux/slices/productSlice";
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Search, ArrowBack } from "@mui/icons-material";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { items, categories, loading, error, searchResults } = useSelector(
    (state) => state.product
  );

  const currentLang = useSelector((state) => state.myLang.lang);
  const myContent = useSelector((state) => state.myLang.content);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProductsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      dispatch(searchProductsAsync(searchTerm));
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(setSearchResults([]));
    setCurrentPage(1);
  };

  const categoryTranslations = {
    electronics: { en: "Electronics", ar: "إلكترونيات" },
    clothing: { en: "men's clothing", ar: "ملابس" },
  };

  let displayedProducts = searchResults.length > 0 ? searchResults : items;

  if (selectedCategory !== "All") {
    displayedProducts = displayedProducts.filter(
      (p) => p.category?.name === selectedCategory
    );
  }

  if (priceFilter === "lowToHigh") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => a.price - b.price
    );
  } else if (priceFilter === "highToLow") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => b.price - a.price
    );
  }

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} thickness={4.5} color="primary" />
      </Box>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        direction: currentLang === "ar" ? "rtl" : "ltr",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#212121",
          borderBottom: "3px solid #1976d2",
          pb: 1,
          mb: 3,
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {myContent.products}
      </Typography>

      {/* Filters */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        mb={3}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {[
            { label: myContent.all, value: "All" },
            ...(categories || []).map((c) => {
              const translated =
                categoryTranslations[c.name?.toLowerCase()]?.[currentLang] ||
                c.name;
              return { label: translated, value: c.name };
            }),
          ].map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              clickable
              color={selectedCategory === cat.value ? "primary" : "default"}
              onClick={() => setSelectedCategory(cat.value)}
            />
          ))}
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: { xs: 2, md: 0 }, width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            placeholder={myContent.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ fontWeight: 600, width: { xs: "100%", sm: "auto" } }}
          >
            {myContent.search}
          </Button>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <InputLabel>{myContent.sortByPrice}</InputLabel>
            <Select
              value={priceFilter}
              label={myContent.sortByPrice}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <MenuItem value="">{myContent.none}</MenuItem>
              <MenuItem value="lowToHigh">{myContent.lowToHigh}</MenuItem>
              <MenuItem value="highToLow">{myContent.highToLow}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {searchResults.length > 0 && (
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleClearSearch}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          {myContent.backToAllProducts}
        </Button>
      )}

      <ProductList products={currentProducts} />

      {/*  Pagination */}
      {totalPages > 1 && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "contained" : "outlined"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ProductPage;
