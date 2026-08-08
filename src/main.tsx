import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { applyPwaClass } from './utils/pwa.ts'

applyPwaClass()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
