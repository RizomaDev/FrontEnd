import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import LoginPage from "../../assets/LoginPage.jpg";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/MapView");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error en el inicio de sesión. Por favor, verifica tus credenciales."
      );
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center [filter:sepia(40%)]"
        style={{
          backgroundImage: `url(${LoginPage})`,
          }}
      >
        <div className="card w-96 bg-base-100 shadow-xl p-4">
          <div className="card-body items-center text-left">
            <h2 className="card-title text-4xl font-bold text-primary mb-6">
              Iniciar sesión
            </h2>
            {error && (
              <div role="alert" className="alert alert-error mb-4 w-full">
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

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Correo electrónico</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  {...register("email", {
                    required: "El correo electrónico es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Dirección de correo electrónico inválida.",
                    },
                  })}
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
                  placeholder="Password"
                  className="input input-bordered w-full"
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 8,
                      message: "La contraseña no es válida. Incluye mayúsculas, minúsculas, números y caracteres especiales.  ",
                    },
                    maxLength: {
                      value: 120,
                      message: "La contraseña no es válida. Incluye mayúsculas, minúsculas, números y caracteres especiales.",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^()_+=-]).{8,}$/,
                      message: "La contraseña no es válida. Incluye mayúsculas, minúsculas, números y caracteres especiales.",
                    },
                  })}
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
                Iniciar sesión
              </button>
            </form>
            <div className="text-sm">
              <p className="mb-1">
                ¿No estás registrado?{" "}
                <a
                  href="./Register"
                  className="link link-hover text-primary font-semibold"
                >
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
