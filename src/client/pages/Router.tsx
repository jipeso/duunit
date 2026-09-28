import { Routes, Route } from 'react-router'

import Home from './Home'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'
import Admin from './Admin'
import Applications from './Applications'
import NewApplication from './NewApplication'
import GuestRoute from '../components/GuestRoute'

const Router = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>
      <Route path='/profile' element={<Profile />} />
      <Route path='/applications' element={<Applications />} />
      <Route path='/applications/new' element={<NewApplication />} />
      <Route path='/admin' element={<Admin />} />
      <Route path='*' element={<Home />} />
    </Routes>
  )
}

export default Router
