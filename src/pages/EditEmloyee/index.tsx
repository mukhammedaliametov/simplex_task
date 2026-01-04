import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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

const API_URL = "https://6915c6cd465a9144626d8a12.mockapi.io/simplex_task";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ma’lumot topilmadi");
        return res.json();
      })
      .then((data) => {
        reset(data);
      })
      .catch(() => {
        toast.error("Xodim ma’lumotlarini yuklab bo‘lmadi");
        navigate("/");
      });
  }, [id, reset, navigate]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Xatolik");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Xodim muvaffaqiyatli yangilandi");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/");
    },
    onError: () => {
      toast.error("Saqlashda xatolik yuz berdi");
    },
  });

  const onSubmit = (data: FormData) => {
    const toastId = toast.loading("Yangilanmoqda...");
    mutation.mutate(data, {
      onSettled: () => toast.dismiss(toastId),
    });
  };

  return (
    <main className="bg-[#1E1E1E] min-h-screen text-white">
      <Toaster position="top-center" />
      <header className="bg-[#353535] h-[70px] flex items-center">
        <div className="max-w-[1620px] w-full mx-auto px-4">
          <h2 className="text-xl font-semibold">Xodimni tahrirlash</h2>
        </div>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[900px] mx-auto mt-6 bg-[#2A2A2A] p-6 rounded-md space-y-6"
      >
        <section>
          <h3 className="text-lg mb-4 font-semibold">Shaxsiy ma’lumotlar</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>F.I.SH</label>
              <input
                {...register("fullName", {
                  required: "F.I.SH majburiy",
                })}
                className="input"
              />
              {errors.fullName && (
                <p className="error">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label>Telefon raqam</label>
              <input
                {...register("phoneNumber", {
                  required: "Telefon raqam majburiy",
                })}
                className="input"
              />
              {errors.phoneNumber && (
                <p className="error">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label>Email</label>
              <input
                {...register("email", {
                  required: "Email majburiy",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Email noto‘g‘ri formatda",
                  },
                })}
                className="input"
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div>
              <label>Tug‘ilgan sana</label>
              <input
                type="date"
                {...register("birthDate", {
                  required: "Tug‘ilgan sana majburiy",
                })}
                className="input"
              />
              {errors.birthDate && (
                <p className="error">{errors.birthDate.message}</p>
              )}
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg mb-4 font-semibold">Ish ma’lumotlari</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Lavozim</label>
              <input
                {...register("position", { required: "Lavozim majburiy" })}
                className="input"
              />
              {errors.position && (
                <p className="error">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label>Bo‘lim</label>
              <input
                {...register("department", { required: "Bo‘lim majburiy" })}
                className="input"
              />
              {errors.department && (
                <p className="error">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label>Boshlash sanasi</label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Boshlash sanasi majburiy",
                })}
                className="input"
              />
            </div>

            <div>
              <label>Ish turi</label>
              <select {...register("employmentType")} className="input">
                <option value="full-time">To‘liq stavka</option>
                <option value="part-time">Yarim stavka</option>
                <option value="internship">Amaliyotchi</option>
              </select>
            </div>

            <div>
              <label>Menejer ismi</label>
              <input
                {...register("managerName", {
                  required: "Menejer ismi majburiy",
                })}
                className="input"
              />
            </div>

            <div>
              <label>Status</label>
              <select {...register("status")} className="input">
                <option value="onboarding">Moslashuvda</option>
                <option value="probation">Sinov muddati</option>
                <option value="active">Faol</option>
                <option value="inactive">Faol emas</option>
              </select>
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-gray-600 rounded-md cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-5 py-2 bg-[#FF733B] rounded-md disabled:opacity-50 cursor-pointer"
          >
            Saqlash
          </button>
        </div>
      </form>
      <style>{`
        .input {
          background:#1E1E1E;
          border:1px solid #444;
          padding:10px;
          border-radius:6px;
          color:white;
          width:100%;
        }
        .error {
          color:#f87171;
          font-size:14px;
          margin-top:4px;
        }
      `}</style>
    </main>
  );
};

export default EditEmployee;
