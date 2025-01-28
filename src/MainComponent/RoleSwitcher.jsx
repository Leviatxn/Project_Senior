import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage.css";

const RoleSwitcher = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // สถานะการแสดง Dropdown
  const [selectedRole, setSelectedRole] = useState("นิสิต"); // ตัวเลือกปัจจุบัน
  const navigate = useNavigate();

  const roles = [
    { name: "นิสิต", url: "/" },
    { name: "อาจารย์", url: "/professor" },
    { name: "เจ้าหน้าที่", url: "/authority" },
    { name: "บริษัท", url: "/company" },
  ];

  // ดึงค่าจาก localStorage เมื่อโหลดหน้า
  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role.name); // ตั้งค่า Default ใหม่
    localStorage.setItem("selectedRole", role.name); // บันทึกค่าใน localStorage
    setDropdownVisible(false); // ปิด Dropdown
    navigate(role.url); // เปลี่ยนเส้นทางไปยัง URL ของบทบาทที่เลือก
  };

  return (
    <div className="role-switcher">
      <p className="role-change-text">
        เข้าสู่ระบบโดยเป็น{" "}
        <a
          className="role-changer"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          {selectedRole}
          <img
            src="public/down-arrow.png"
            alt="drop-down"
            style={{ width: "15px", height: "15px", marginLeft: "5%" }}
          />
        </a>
      </p>

      {dropdownVisible && (
        <div
          className="dropdown-menu"
          style={{
            top: "0",
            marginTop: "10px",
            marginLeft: "48%",
            zIndex: 10,
          }}
        >
          {roles.map((role) => (
            <div
              key={role.name}
              onClick={() => handleRoleChange(role)}
              style={{
                fontSize: "16px",
                padding: "5px 20px",
                cursor: "pointer",
                backgroundColor:
                  selectedRole === role.name ? "#f0f0f0" : "transparent",
              }}
            >
              {role.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
