import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, InputLabel } from "@mui/material";

const ProjectForm = ({ handleSubmit, handleInputChange, handleFileChange, projectData }) => {
    const [file, setFile] = useState(null);

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        handleFileChange(selectedFile);
    };

    return (
        <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* คอลัมน์ซ้าย */}
                    <Grid item xs={10} sm={6} >
                        <InputLabel htmlFor="title">ชื่อหัวข้อโครงงาน</InputLabel>
                            <TextField
                                id="title"
                                name="title"
                                value={projectData.title}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                sx={{ mb: 2, bgcolor: "white" }} // เพิ่ม margin bottom
                            />

                    </Grid>
                    <Grid item xs={12}  >

                        <InputLabel htmlFor="details">รายละเอียดโครงงาน</InputLabel>
                        <TextField
                            id="details"
                            name="details"
                            value={projectData.details}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            fullWidth
                            required
                            sx={{ mb: 2, bgcolor: "white" }}
                        />

                        
                    </Grid>

                    {/* คอลัมน์ขวา */}
                    <Grid item xs={12} sm={6}>

                        <InputLabel htmlFor="advisor">อาจารย์ที่ปรึกษา</InputLabel>
                        <TextField
                            id="advisor"
                            name="advisor"
                            value={projectData.advisor}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            sx={{ bgcolor: "white" }}
                        />

                        <InputLabel htmlFor="committee1">กรรมการท่านที่ 1</InputLabel>
                        <TextField
                            id="committee1"
                            name="committee1"
                            value={projectData.committee1}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            sx={{ mb: 2, bgcolor: "white" }}
                        />

                        <InputLabel htmlFor="committee2">กรรมการท่านที่ 2</InputLabel>
                        <TextField
                            id="committee2"
                            name="committee2"
                            value={projectData.committee2}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            sx={{ mb: 2, bgcolor: "white" }}
                        />

                        
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        
                        
                    </Grid>


                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Button variant="contained" component="label" sx={{ width: '30%' }}>
                            {file ? file.name : "อัปโหลดไฟล์ที่นี่"}
                            <input type="file" id="project-file" name="file" hidden onChange={handleFileSelect} />
                        </Button>
                        
                        <Button type="submit" variant="contained" color="primary" sx={{ px: 4, py: 1.5, fontSize: "1rem", width: '30%' }}>
                            ส่งโครงงานสหกิจ
                        </Button>
                    </Grid>



                </Grid>
            </form>
        </Box>
    );
};

export default ProjectForm;