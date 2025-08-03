import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../service/handleToken";
import { toastNotif } from "../utils/ToastNotif";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import axios from "axios";

const LoginSchema = z.object({
    username: z.string().min(1, "نام کاربری الزامی است"),
    password: z.string().min(1, "رمز عبور الزامی است"),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LoginSchema),
    });

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            // کاربر توکن داره، پس مستقیم میریم صفحه اصلی
            navigate("/", { replace: true });
        }
    }, [navigate]);
    const loginMutation = useMutation({
        mutationFn: async (formData) => {
            const res = await axios.post("http://185.204.197.17:8000/sapi/token/", formData);
            return res.data;
        },
        onSuccess: async (data) => {
            try {
                api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
                await api.get("/sapi/dist/send-posts/");
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                navigate("/");
            } catch {
                toastNotif("ورود نامعتبر: توکن صحیح نیست", "error");
            }
        },
        onError: (err) => {

            const status = err?.response?.status;
            if (status === 400 || status === 401) {
                toastNotif("نام کاربری یا رمز عبور اشتباه است", "error");
            } else {
                toastNotif("خطا در ارتباط با سرور", "error");
            }
        },
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };
    console.log(loginMutation)
    if (isCheckingAuth) return null;

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                bgcolor: "#437c99",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="bg-[#e3f2fd] p-6 rounded-[30px] shadow-xl w-[320px]">
                <div className="flex justify-center mb-0">
                    <img src={logo} alt="Logo" className="w-[200px] h-[130px]" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-10 gap-4">
                    {/* Username */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm  text-black font-YekanBakh_Bold">نام کاربری</label>
                        <input
                            placeholder="..."
                            type="text"
                            dir="rtl"
                            {...register("username")}
                            className="border border-gray-300 text-sm px-2 h-[32px] rounded-sm bg-white font-YekanBakh_Regular placeholder:text-gray-500"
                        />
                        {errors.username && (
                            <span className="text-red-500 text-xs font-YekanBakh_Regular">{errors.username.message}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-black font-YekanBakh_Bold">رمز عبور</label>
                        <input
                            placeholder="..."
                            type="password"
                            dir="rtl"
                            {...register("password")}
                            className="border border-gray-300 text-sm px-2 h-[32px] rounded-sm bg-white font-YekanBakh_Regular placeholder:text-gray-500"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs font-YekanBakh_Regular">{errors.password.message}</span>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-[#437c99] flex items-center gap-x-2 justify-center text-white text-sm font-YekanBakh_Bold py-1 rounded-sm hover:bg-[#37677f] transition"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending && (
                            <CircularProgress size={18} color="inherit" />
                        )}
                        {loginMutation.isPending ? "در حال ورود..." : "ورود"}
                    </button>

                    {loginMutation.isError && (
                        <Typography color="error" textAlign="center" className="text-sm mt-2 font-YekanBakh_Regular">
                            خطا در ورود
                        </Typography>
                    )}
                </form>
            </div>
        </Box>
    );
};

export default LoginPage;
