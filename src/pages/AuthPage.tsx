import { useState } from "react";
import { login, register } from "../services/authService";
import { ChevronLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("member");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("member");
    setError("");
    setShowPassword(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        console.log("Login exitoso");
      } else {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden");
          setLoading(false);
          return;
        }
        await register(name, email, password, role);
        console.log("Registro exitoso");
        setIsLogin(true);
        resetFields();
      }
    } catch (err) {
      setError(isLogin ? "Credenciales incorrectas." : "Error al registrar. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#e2e8f0] to-[#f8fafc] px-4">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            {isLogin ? "Bienvenido a MetriTask" : "Crear cuenta"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Inicia sesión para continuar" : "Regístrate para empezar"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <InputWithIcon
                icon={<User size={18} />}
                id="name"
                label="Nombre completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introduce tu nombre"
              />

              <div>
                <label htmlFor="role" className="block text-gray-700 font-medium mb-1">
                  Rol
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-white"
                  required
                >
                  <option value="member">Miembro</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </>
          )}

          <InputWithIcon
            icon={<Mail size={18} />}
            id="email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Introducir tu correo electrónico"
          />

          <InputWithIcon
            icon={<Lock size={18} />}
            id="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introducir tu contraseña"
            suffix={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {!isLogin && (
            <InputWithIcon
              icon={<Lock size={18} />}
              id="confirm-password"
              label="Confirmar contraseña"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-all"
          >
            {loading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  resetFields();
                }}
                className="text-indigo-600 hover:underline font-medium"
              >
                Regístrate
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                resetFields();
              }}
              className="flex items-center justify-center mx-auto text-indigo-600 hover:underline gap-1"
            >
              <ChevronLeft size={16} />
              Volver al inicio de sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InputWithIcon({
  icon,
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  suffix
}: {
  icon: React.ReactNode;
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        {suffix && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{suffix}</div>}
      </div>
    </div>
  );
}
