import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import BeyondCode from './components/BeyondCode'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <div className="grain-overlay" />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <BeyondCode />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
