import { useEffect, useState, useRef } from "react";
import { BiPlus } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

type Employee = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  position: string;
};

const API_URL = "https://6915c6cd465a9144626d8a12.mockapi.io/simplex_task";

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

  const formatNumber = (phone: string | number): string => {
    const cleaned = String(phone).replace(/\D/g, "");

    const match = cleaned.match(/^(998)(\d{2})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }

    return String(phone);
  };

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteEmployee = async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("O‘chirishda xatolik");
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast.success("Xodim o‘chirildi");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("O‘chirishda xatolik");
    },
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
              className="py-[5px] flex items-center gap-[8px] px-[12px] rounded-md text-white cursor-pointer hover:opacity-90 border border-white"
            >
              <FiLogOut className="text-[18px]" /> Chiqish
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

        <table className="w-full border-collapse">
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
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-600 last:border-none"
                >
                  <td className="p-3">{`0${emp.id}`}</td>
                  <td className="p-3">{emp.fullName}</td>
                  <td className="p-3">{formatNumber(emp.phoneNumber)}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.position}</td>
                  <td className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === emp.id ? null : emp.id)
                      }
                      className={`cursor-pointer hover:bg-[#00000052] px-[6px] mr-[-8px] py-3 rounded-md ${openMenuId === emp.id ? 'bg-[#00000052]' : 'bg-transparent'} `}
                    >
                      <SlOptionsVertical />
                    </button>

                    {openMenuId === emp.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 text-[14px] flex flex-col mt-2 overflow-hidden w-[120px] bg-[#2A2A2A] border border-gray-600 rounded-md shadow-lg z-10"
                      >
                        <button
                          onClick={() => navigate(`/edit-employee/${emp.id}`)}
                          className="w-full flex items-center gap-[5px] py-2 cursor-pointer pl-2 border-b border-gray-600 text-left hover:bg-[#353535]"
                        >
                          <TbEdit size={22} /> Tahrirlash
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(emp.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-[5px] py-2 cursor-pointer pl-2 text-left hover:bg-red-600 text-red-400 hover:text-white"
                        >
                          <MdDelete size={20} /> O‘chirish
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-md w-[350px]">
            <h3 className="text-lg font-semibold mb-3">Xodimni o‘chirish</h3>
            <p className="text-gray-300 mb-5">
              Rostdan ham ushbu xodimni o‘chirmoqchimisiz?
            </p>
            <div className="flex justify-start gap-3">
              <button
                onClick={() => {
                  deleteMutation.mutate(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 rounded-md bg-red-600 hover:opacity-90 cursor-pointer"
              >
                Ha, o‘chirish
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md bg-gray-600 hover:opacity-90 cursor-pointer"
              >
                Yo‘q
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
