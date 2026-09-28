"use client";

import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { shortenUrl } from "@/api/urlApi";
import ResultCard from "@/components/ResultCard";

export default function HomePage() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputUrl.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      console.log("Sending URL:", inputUrl);

      const response = await shortenUrl(inputUrl);

      console.log("Backend response:", response);

      const data = response.data;

      setResult({
        shortUrl: data.shortUrl,
        longUrl: inputUrl,
      });

      setInputUrl("");
    } catch (err) {
      console.error("SHORTEN URL ERROR:", err);
      console.error("Response:", err.response);
      console.error("Response data:", err.response?.data);

      setErrorMsg(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to shorten URL.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Minify Your Links
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Paste your long URL below to generate a short, clean link.
        </Typography>
      </Box>

      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <TextField
          fullWidth
          required
          type="url"
          label="Paste a long URL"
          placeholder="https://example.com/very/long/path/name"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          disabled={loading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ height: 48, fontWeight: "bold" }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Shorten URL"
          )}
        </Button>
      </Paper>

      {errorMsg && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {result && (
        <ResultCard shortUrl={result.shortUrl} longUrl={result.longUrl} />
      )}
    </Container>
  );
}
