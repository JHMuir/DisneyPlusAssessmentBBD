import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import {App} from './components/App.tsx'
// import {Test} from './components/Test.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="disney-plus">
      <img src="disney-plus-placeholder.png" alt="Jordan's Disney+"/>
    </div>
    <App/>
    {/* <Test /> */}
  </StrictMode>,
)

