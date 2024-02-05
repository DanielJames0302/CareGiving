import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux'
import './navbar.css'

const NavbarMenu = () => {
  const user = useSelector((state) => state.user)

  return (
    <Navbar collapseOnSelect  expand="lg" className="navbar text-light">
    <Container>
      <Navbar.Brand className='text-light'  href="/home">Big At Heart</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">

        <Nav className="me-auto">
          <Nav.Link className='text-light'  href="/home">Home</Nav.Link>
          {user.isLoggedIn && <Nav.Link className='text-light'  href="/activity">Activity</Nav.Link> }
          {user.isAdmin && <Nav.Link className='text-light'  href="/manage_admin">Activity</Nav.Link> }
          
        </Nav>
        {user.isLoggedIn === false ? <Nav>
          <Nav.Link className='text-light' href="/login">Login</Nav.Link>
          <Nav.Link className='text-light' eventKey={2} href="/login">
            Signup
          </Nav.Link>
        </Nav> :
        <Nav>
        <Nav.Link href="/myprofile"> <img className='profile-picture' alt='default-profile' src={process.env.PUBLIC_URL+"images/default-profile-picture.jpg"}  /></Nav.Link>
       
        </Nav>
        
        }
       
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default NavbarMenu
