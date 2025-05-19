import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import Login from './components/login/Login'
import Layout from './components/layout/Layout'
import { ToastContainer } from 'react-toastify'
import UserAdminComponent from './components/admin/UserAdminComponent'
import Home from './components/home/Home'
import Buyrutmalar from './components/buyrutmalar/Buyrutmalar'
import Tariflar from './components/tariflar/Tariflar'
import Box from './components/box/Box'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path='/' element={
          <PrivateRoute>
            <Layout/>
          </PrivateRoute>
        }>
          <Route path="workers" element={<Home />} />
          <Route path="users" element={<UserAdminComponent />} />
          <Route path="box" element={<Box />} />
          <Route path="buyutmalar" element={<Buyrutmalar />} />
          <Route path="tariflar" element={<Tariflar />} />

          {/* <Route path="user" element={<UserAdminComponent />} /> */}
        </Route>
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App
