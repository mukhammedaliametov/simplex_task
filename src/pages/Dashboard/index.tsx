import { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

type Employee = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  position: string;
};

const API_URL = 'https://6915c6cd465a9144626d8a12.mockapi.io/simplex_task';

const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Xatolik");
  const data = await res.json();
  return data.reverse();
};

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") === "true") {
      toast.success("Tizimga muvaffaqiyatli kirildi");
      localStorage.removeItem("justLoggedIn");
    }
  }, []);

  return (
    <main className="bg-[#1E1E1E] w-full min-h-screen text-white">
      <Toaster position="top-center" />
      <header className="bg-[#353535] flex items-center w-full h-[70px]">
        <div className="max-w-[1620px] w-full mx-auto flex items-center justify-between px-4">
          <h2 className="text-xl font-semibold">HR Management</h2>
          <div className="flex items-center gap-[10px]">
            <button
              onClick={() => navigate("/add-employee")}
              className="flex items-center gap-2 py-[6px] px-[12px] rounded-md text-white cursor-pointer hover:opacity-90 bg-[#FF733B]"
            >
              <BiPlus className="text-[20px]" />
              Xodim qo‘shish
            </button>
            <button
              onClick={handleLogout}
              className="py-[5px] px-[12px] rounded-md text-white cursor-pointer hover:opacity-90 border border-white"
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1620px] mx-auto p-4">
        <header className="mb-4 mt-2 flex items-center justify-between">
          <h2 className="text-xl">Xodimlar ro'yxati</h2>
          <div className="flex items-center gap-[10px] border rounded-md py-2 pr-4 pl-3">
            <FiSearch className="text-xl" />
            <input
              type="text"
              placeholder="Xodim qidirish"
              className="outline-none w-sm"
            />
          </div>
        </header>

        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead className="bg-[#353535]">
            <tr>
              <th className="text-left p-3 font-semibold">ID</th>
              <th className="text-left p-3 font-semibold">F.I.SH</th>
              <th className="text-left p-3 font-semibold">Tel raqami</th>
              <th className="text-left p-3 font-semibold">Email</th>
              <th className="text-left p-3 font-semibold">Lavozim</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-600 last:border-none"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{emp.fullName}</td>
                  <td className="p-3">{emp.phoneNumber}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.position}</td>
                  <td>
                    <SlOptionsVertical />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Dashboard;
