import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

type FormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  position: string;
  department: string;
  startDate: string;
  employmentType: "full-time" | "part-time" | "internship";
  managerName: string;
  status: "active" | "onboarding" | "probation" | "inactive";
};

const AddEmployee = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const API_URL = 'https://6915c6cd465a9144626d8a12.mockapi.io/simplex_task';

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Xatolik");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Xodim muvaffaqiyatli qo‘shildi");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      reset();
      setTimeout(() => {
        navigate("/");
      }, 1220);
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });

  const onSubmit = (data: FormData) => {
    const toastId = toast.loading("Saqlanmoqda...");
    mutation.mutate(data, {
      onSettled: () => toast.dismiss(toastId),
    });
  };

  return (
    <main className="bg-[#1E1E1E] min-h-screen text-white">
      <Toaster position="top-center" />

      <header className="bg-[#353535] h-[70px] flex items-center">
        <div className="max-w-[1620px] w-full mx-auto px-4">
          <h2 className="text-xl font-semibold">Xodim qo‘shish</h2>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[900px] mx-auto mt-6 bg-[#2A2A2A] p-6 rounded-md space-y-6"
      >
        <section>
          <h3 className="text-lg mb-4 font-semibold">Shaxsiy ma’lumotlar</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-[2px]">
              <label htmlFor="fullname">F.I.SH</label>
              <input
                {...register("fullName", {
                  required: "F.I.SH majburiy kiritiladi",
                })}
                placeholder="Palonchiev Palonchi"
                className="input w-full"
                id="fullname"
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="pnumber">Telefon raqam</label>
              <input
                {...register("phoneNumber", {
                  required: "Telefon raqam majburiy",
                })}
                placeholder="Telefon raqam"
                className="input w-full"
                id="pnumber"
                type="pnumber"
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="email">Email mazili</label>
              <input
                {...register("email", {
                  required: "Email majburiy",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Email noto‘g‘ri formatda",
                  },
                })}
                placeholder="exmaple@email.com"
                className="input"
                type="email"
                id="email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="birthDate">Tug'ilan sana</label>
              <input
                type="date"
                {...register("birthDate", {
                  required: "Tug'ilan sana majburiy",
                })}
                className="input"
                id="birthDate"
              />
              {errors.birthDate && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg mb-4 font-semibold">Ish ma’lumotlari</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-[2px]">
              <label htmlFor="position">Lavozim</label>
              <input
                {...register("position", {
                  required: "Lavozim majburiy",
                })}
                placeholder="Lavozim"
                id="position"
                className="input"
              />
              {errors.position && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="department">Bo'lim</label>
              <input
                {...register("department", {
                  required: "Bo‘lim majburiy",
                })}
                id="department"
                placeholder="Bo‘lim"
                className="input"
              />
              {errors.department && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="startDate">Boshlash sanasi</label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Boshlanish sanasi majburiy",
                })}
                className="input"
                id="startDate"
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="employmentType">Ish turi</label>
              <select
                {...register("employmentType", {
                  required: "Ish turini tanlang",
                })}
                className="input"
                style={{ padding: "12px 6px" }}
                id="employmentType"
              >
                <option value="" hidden>
                  Ish turi
                </option>
                <option value="full-time">To‘liq stavka</option>
                <option value="part-time">Yarim stavka</option>
                <option value="internship">Amaliyotchi</option>
              </select>
              {errors.employmentType && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.employmentType.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="managerName">Manager ismi</label>

              <input
                {...register("managerName", {
                  required: "Manager ismi majburiy",
                })}
                placeholder="Menejer ismi"
                className="input"
                id="managerName"
              />
              {errors.managerName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.managerName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="status">Status</label>
              <select
                {...register("status", { required: "Statusni tanlang" })}
                className="input"
                style={{ padding: "12px 6px" }}
                id="status"
              >
                <option value="" hidden>
                  Status
                </option>
                <option value="onboarding">Moslashuvda</option>
                <option value="probation">Sinov muddati</option>
                <option value="active">Faol</option>
                <option value="inactive">Faol emas</option>
              </select>
              {errors.status && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-md bg-gray-600 hover:opacity-90 cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-5 py-2 rounded-md bg-[#FF733B] hover:opacity-90 cursor-pointer disabled:opacity-50"
          >
            Saqlash
          </button>
        </div>
      </form>

      <style>
        {`
          .input {
            background-color: #1E1E1E;
            border: 1px solid #444;
            padding: 10px;
            border-radius: 6px;
            outline: none;
            color: white;
          }
          .input::placeholder {
            color: #aaa;
          }
        `}
      </style>
    </main>
  );
};

export default AddEmployee;
