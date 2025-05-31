import { useState } from "react";
import { login, register } from "../services/authService";
import { FiUser, FiEye, FiMail, FiLock, FiEyeOff, FiChevronLeft, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

  const navigate = useNavigate();
  const { setUser } = useAuth();

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
        console.log('Iniciando proceso de login...');
        const response = await login(email, password);
        console.log('Login exitoso:', response);
        
        if (response.user) {
          console.log('Usuario obtenido, actualizando contexto...');
          setUser(response.user);
          console.log('Redirigiendo a /projects...');
          navigate("/projects", { replace: true });
        } else {
          throw new Error("No se pudo obtener la información del usuario");
        }
      } else {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden");
          setLoading(false);
          return;
        }
        await register(name, email, password, role);
        setIsLogin(true);
        resetFields();
      }
    } catch (err: any) {
      console.error('Error en el login:', err);
      setError(err.response?.data?.message || (isLogin ? "Credenciales incorrectas." : "Error al registrar. Verifica los datos."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <img src="/logo.svg" alt="MetriTask Logo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text">
            MetriTask
          </h1>
          <h2 className="text-2xl font-semibold text-gray-200 mt-2">
            {isLogin ? "Bienvenido de nuevo" : "Crear cuenta"}
          </h2>
          <p className="text-gray-400 mt-2">
            {isLogin ? "Inicia sesión para continuar" : "Regístrate para empezar"}
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/50 p-8 hover:border-gray-600/50 transition-all duration-300">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center">
              <FiAlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <InputWithIcon
                  icon={<FiUser className="w-5 h-5" />}
                  id="name"
                  label="Nombre completo"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Introduce tu nombre"
                />

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                    Rol
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-700/50 backdrop-blur-sm text-gray-200"
                    required
                  >
                    <option value="member">Miembro</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </>
            )}

            <InputWithIcon
              icon={<FiMail className="w-5 h-5" />}
              id="email"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu correo electrónico"
            />

            <InputWithIcon
              icon={<FiLock className="w-5 h-5" />}
              id="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              suffix={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              }
            />

            {!isLogin && (
              <InputWithIcon
                icon={<FiLock className="w-5 h-5" />}
                id="confirm-password"
                label="Confirmar contraseña"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando...
                </div>
              ) : isLogin ? "Iniciar Sesión" : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    resetFields();
                  }}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
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
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <FiChevronLeft className="w-4 h-4 mr-1" />
                Volver al inicio de sesión
              </button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <button
              onClick={() => navigate('/')}
              className="w-full inline-flex items-center justify-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              <FiChevronLeft className="w-4 h-4 mr-2" />
              Volver a la landing
            </button>
          </div>
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
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
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-700/50 backdrop-blur-sm text-gray-200 placeholder-gray-400"
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}