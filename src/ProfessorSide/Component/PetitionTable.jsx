import React, { useEffect, useState } from "react";

const PetitionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก Backend
  useEffect(() => {
    fetch("http://localhost:5000/allpetitions")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">
        รายการคำร้องของนักศึกษา
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-200 w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-gray-600">Student ID</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-600">Full Name</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-600">Major</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-600">Year</th>
              <th className="border border-gray-300 px-4 py-2 text-gray-600">Petition Name</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  ไม่พบข้อมูลคำร้อง
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="border border-gray-300 px-4 py-2">{item.StudentID}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.FullName}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.Major}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.Year}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.Petition_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PetitionTable;
