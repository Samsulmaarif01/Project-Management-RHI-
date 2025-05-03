import React from 'react';
import AuthLayout from '../../components/Layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper'; 

const Signup = () => {
  const [profilPic, setProfilPic] = React.useState(null);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [adminInviteToken, setAdminInviteToken] = React.useState('');

  const [error, setError] = React.useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError('Masukkan Nama Lengkap');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email tidak valid');
      return;
    }
    if (!password) {
      setError('Password tidak boleh kosong');
      return;
    }

    setError('');

    // Lanjutkan signup ke API
  };

  return (
    <AuthLayout>
      <div className='lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Buat Akun Baru</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Silakan masukkan Data Lengkap Anda
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilPic} setImage={setProfilPic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              placeholder="Nama Lengkap"
            />
            <Input
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email"
            />
            <Input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Password"
            />
            <Input
              type="text"
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              placeholder="6 digit kode undangan admin"
            />

            {error && (
              <p className='text-red-500 text-sm col-span-2'>{error}</p>
            )}

            <button
              type='submit'
              className='bg-blue-600 text-white p-2 rounded hover:bg-blue-700 col-span-2'
            >
              SignUp
            </button>

            <p className='text-xs text-slate-700 mt-4 col-span-2'>
              Sudah punya akun?{' '}
              <Link to='/login' className='text-blue-600 hover:underline'>
                Masuk
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
