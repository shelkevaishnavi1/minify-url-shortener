"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ResultCard({ shortUrl, longUrl }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mt: 4,
          p: 1,
          borderRadius: 3,
          borderColor: "primary.main",
          bgcolor: "background.paper",
          boxShadow: 2,
        }}
      >
        <CardContent>
          {/* <Typography variant="caption" color="text.secondary" gutterBottom>
            Original: {longUrl }
          </Typography> */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
              mt: 1,
            }}
          >
            <MuiLink
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="h6"
              sx={{
                fontWeight: 600,
                wordBreak: "break-all",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {shortUrl}
              <OpenInNewIcon fontSize="small" />
            </MuiLink>

            <Tooltip title="Copy link">
              <IconButton onClick={handleCopy} color="primary">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
