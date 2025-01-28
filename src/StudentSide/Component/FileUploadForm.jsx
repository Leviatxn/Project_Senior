import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const FileUploadForm = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // เก็บชื่อไฟล์
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: "20px",
        width: "80%",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        เพิ่มไฟล์
      </Typography>

      {/* ฟิลด์อัปโหลดไฟล์ */}
      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }} // ซ่อน input เพื่อใช้ Button แทน
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          sx={{
            borderRadius: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
        >
          อัปโหลดไฟล์
        </Button>
      </label>

      {/* แสดงชื่อไฟล์ที่เลือก */}
      {fileName && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          ไฟล์ที่เลือก: {fileName}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadForm;
