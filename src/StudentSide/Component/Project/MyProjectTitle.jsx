import React, { useEffect, useState } from "react";
import axios from "axios";

const MyProjectTitle = () => {
  const [projectTitle, setProjectTitle] = useState("กำลังโหลด...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      const studentId = localStorage.getItem("studentId");
      const token = localStorage.getItem("authToken");

      if (!studentId) {
        console.error("ไม่พบ studentId ใน localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/coopproject/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.ProjectTitle) {
          setProjectTitle(response.data.ProjectTitle);
        } else {
          setProjectTitle("ไม่มีข้อมูลโครงงาน");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setProjectTitle("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  return (
    <h1 style={{ marginLeft: "50px", marginBottom: "0", color: "#006765" }}>
      {loading ? "กำลังโหลด..." : `“ ${projectTitle} ”`}
    </h1>
  );
};

export default MyProjectTitle;
