import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../../service/authService";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import RegisterPage from "../../assets/RegisterPage.jpg";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      setSuccess("¡Registro exitoso!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error durante el registro. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center [filter:sepia(40%)]"
        style={{
          backgroundImage: `url(${RegisterPage})`,
        }}
      >
        <div className="card w-96 bg-base-100 shadow-xl p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body items-center text-left">
              <h2 className="card-title text-4xl font-bold text-primary mb-6">
                Registrarse
              </h2>
              {error && (
                <div role="alert" className="alert alert-warning text-neutral">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div role="alert" className="alert alert-success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 2,
                      message: "El nombre debe tener al menos 2 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El nombre debe tener como máximo 50 caracteres",
                    },
                  })}
                  placeholder="Nombre"
                  className="input input-bordered w-full"
                />
                {errors.name && (
                  <span className="text-error text-sm mt-1 ">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Correo electrónico</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "El correo electrónico es requerido",
                    maxLength: {
                      value: 120,
                      message: "El correo electrónico debe tener como máximo 120 caracteres",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Dirección de correo electrónico inválida",
                    },
                  })}
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                {errors.email && (
                  <span className="text-error text-sm mt-1 ">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full max-w-xs mb-4">
                <label className="label">
                  <span className="label-text">Contraseña</span>
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 8,
                      message:
                        "La contraseña debe tener al menos 8 caracteres.",
                    },
                    maxLength: {
                      value: 120,
                      message: "La contraseña debe tener como máximo 120 caracteres",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^()_+=-]).{8,}$/,
                      message: "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales",
                    },
                  })}
                  placeholder="Contraseña"
                  className="input input-bordered w-full"
                />
                {errors.password && (
                  <span className="text-error text-sm mt-1 ">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full text-lg py-3 rounded-lg mb-4"
              >
                Registrarse
              </button>

              <div className="text-sm">
                <p className="mb-1">
                  ¿Ya estás registrado?{" "}
                  <a
                    href="./Login"
                    className="link link-hover text-primary font-semibold"
                  >
                    Inicia sesión aquí
                  </a>
                </p>
               
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
