import React from 'react'
import NavBar from './NavBar'

type LayoutProps = {
  children : React.ReactNode
}

const Layout = ({children} : LayoutProps) =>
 {
  return (
    <div>
        <NavBar/>
    {children}</div>
  )
}

export default Layout