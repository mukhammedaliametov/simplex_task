import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

type Employee = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  position: string;
  department: string;
  startDate: string;
  employmentType: string;
  managerName: string;
  status: "active" | "onboarding" | "probation" | "inactive";
};

const API_URL =
  "https://6915c6cd465a9144626d8a12.mockapi.io/simplex_task";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const statusMap = {
    active: { text: "Faol", color: "bg-green-500" },
    onboarding: { text: "Moslashuvda", color: "bg-blue-500" },
    probation: { text: "Sinov muddati", color: "bg-yellow-500 text-black" },
    inactive: { text: "Faol emas", color: "bg-red-500" },
  };

  if (isLoading)
    return (
      <div className="bg-[#1E1E1E] min-h-screen text-white flex items-center justify-center">
        Yuklanmoqda...
      </div>
    );

  if (isError || !data) {
    toast.error("Ma’lumotni yuklashda xatolik");
    return null;
  }

  return (
    <main className="bg-[#1E1E1E] min-h-screen text-white">
      <Toaster position="top-center" />

      <header className="bg-[#353535] h-[70px] flex items-center">
        <div className="max-w-[1620px] w-full mx-auto px-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Xodim haqida ma’lumot</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-[10px] border rounded-md hover:opacity-90 cursor-pointer"
          >
            Orqaga
          </button>
        </div>
      </header>

      <div className="max-w-[900px] mx-auto mt-6 bg-[#2A2A2A] p-6 rounded-md space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{data.fullName}</h3>
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              statusMap[data.status].color
            }`}
          >
            {statusMap[data.status].text}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <Info label="Telefon raqam" value={data.phoneNumber} />
          <Info label="Email" value={data.email} />
          <Info label="Tug‘ilgan sana" value={data.birthDate} />
          <Info label="Lavozim" value={data.position} />
          <Info label="Bo‘lim" value={data.department} />
          <Info label="Boshlagan sana" value={data.startDate} />
          <Info label="Ish turi" value={translateType(data.employmentType)} />
          <Info label="Menejer" value={data.managerName} />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => navigate(`/edit-employee/${data.id}`)}
            className="px-5 py-2 bg-[#FF733B] rounded-md hover:opacity-90 cursor-pointer"
          >
            Tahrirlash
          </button>
        </div>
      </div>
    </main>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-400 mb-1">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

const translateType = (type: string) => {
  if (type === "full-time") return "To‘liq stavka";
  if (type === "part-time") return "Yarim stavka";
  if (type === "internship") return "Amaliyotchi";
  return type;
};

export default EmployeeDetails;
