import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/auth'
import { FaUser, FaLock } from 'react-icons/fa'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const user = await login(username, password)
      if (user.role === 'admin') navigate('/admin')
      else navigate('/language')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Segoe UI', Arial, sans-serif;
          }

          .background-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle, #ff3a3c 0%, #a70311 100%);
            gap: 25px; 
          }

          .login-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 550px; 
            padding: 40px; 
            background-color: #fefefe;
            border-radius: 30px;
            overflow: hidden;
            transform: translateZ(0);
            
            /* ADDED: Smooth multi-layered box shadow for a premium depth effect */
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);
          }

          .card-banner {
            width: calc(100% + 82px); 
            margin-left: -41px; 
            margin-right: -41px; 
            margin-top: -41px; 
            margin-bottom: 20px;
            
            height: 185px; 
            object-fit: cover; 
            object-position: top; 
          }

          .login-subtitle {
            color: #1c1c1c;
            font-size: 23px;
            font-weight: 600;
            text-align: center;
            margin-top: 0 !important;
            margin-bottom: 20px !important;
          }

          .notice-title {
            color: #bf161a; 
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 5px;
            text-align: center;
            margin-top: 0 !important;
          }

          .input-group {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
            margin-bottom: 25px;
          }

          .input-wrapper {
            position: relative;
            width: 450px;
            display: flex;
            align-items: center;
          }

          .input-icon {
            position: absolute;
            left: 18px; 
            color: #b7b7b7; 
            font-size: 15px;
          }

          .login-input {
            width: 100% !important;
            padding: 10px 20px 10px 45px !important; 
            border-radius: 10px !important;
            border: 2px solid #d8d8d8 !important; 
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.06) !important;
            background-color: #fefefe !important;
            font-size: 15px;
            color: #212121;
            box-sizing: border-box;
            outline: none;
          }
          
          .login-input:focus {
            border-color: #ce1126 !important;
          }

          .input-wrapper:focus-within .input-icon {
            color: #ce1126 !important;
          }

          .login-button {
            background-color: #f4972d; 
            color: white;
            border: none;
            width: 200px !important; 
            padding: 12px 0px !important;
            border-radius: 10px !important; 
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
          }

          .login-button:hover {
            background-color: #e78c24;
          }

          .login-button:disabled {
            background-color: #ffcc66;
            cursor: not-allowed;
          }

          .login-error {
            color: #ce1126;
            margin-top: -15px;
            margin-bottom: 10px;
            font-size: 14px;
            text-align: center;
            font-weight: 500;
          }
        `}
      </style>
      
      <div className="background-container">
        
        <div className="login-card">
          <img src="regcrisbanner.png" alt="Regcris Banner" className="card-banner" />
          
          <h1 className="notice-title">NOTICE TO EXPLAIN GENERATOR</h1>
          <h2 className="login-subtitle">USER LOGIN</h2>
          
          <div className="input-group">
            
            {/* WRAPPED USERNAME INPUT */}
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setError('')}
              />
            </div>

            {/* WRAPPED PASSWORD INPUT */}
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setError('')}
              />
            </div>

          </div>

          {error && <p className="login-error">{error}</p>}
          
          <button className="login-button" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Log-in'}
          </button>
        </div>
      </div>
    </>
  )
}