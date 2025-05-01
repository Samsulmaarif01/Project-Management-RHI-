import React from 'react';
import AuthLayout from '../../components/Layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import Logo from '../../assets/images/Logo RHI.png'; // Pastikan path ini benar
import { validateEmail } from '../../utils/helper';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  // Fungsi untuk menangani login
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError('Email tidak valid');
      return;
    }

    if (!password) {
      setError('Password tidak boleh kosong');
      return;
    }

    setError(''); 

    // melakukan login ke API

  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center items-center'>
        <img src={Logo} alt="Logo RHI" className="w-40" /> {/* Lebih besar, tanpa mb */}
        <h3 className='text-xl font-semibold text-black -mt-1'>Selamat Datang</h3> {/* -mt menghilangkan gap */}
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Silakan masukkan email dan password
        </p>

        <form onSubmit={handleLogin} className='w-full flex flex-col gap-4'>
          <div className='flex flex-col'>
            <label htmlFor='email' className='text-sm text-gray-600 mb-1'>Email Address</label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder='Email'
              className='p-2 border border-gray-300 rounded'
              required
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='password' className='text-sm text-gray-600 mb-1'>Password</label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder='Password'
              className='p-2 border border-gray-300 rounded'
              required
            />
          </div>

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button type='submit' className='bg-blue-600 text-white p-2 rounded hover:bg-blue-700'>
            Login
          </button>

          <p className='text-xs text-slate-700 mt-4'>
            Belum punya akun?{' '}
            <a href='/signup' className='text-blue-600 hover:underline'>
              Daftar Sekarang
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
