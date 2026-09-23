import { Routes, Route } from 'react-router'

import Home from './Home'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'
import Admin from './Admin'

const Router = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/admin' element={<Admin />} />
      <Route path='*' element={<Home />} />
    </Routes>
  )
}

export default Router
