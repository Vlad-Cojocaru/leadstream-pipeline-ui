import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeWebhooks } from './config/webhook'

// Initialize webhook configuration
initializeWebhooks()

createRoot(document.getElementById("root")!).render(<App />);
