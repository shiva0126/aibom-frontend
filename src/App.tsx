import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview    from './pages/Overview';
import AISystems   from './pages/AISystems';
import AIBOM       from './pages/AIBOM';
import SupplyChain from './pages/SupplyChain';
import AgentsMCP   from './pages/AgentsMCP';
import RAGLineage  from './pages/RAGLineage';
import Findings    from './pages/Findings';
import AttackPaths from './pages/AttackPaths';
import Integrations from './pages/Integrations';
import Reports     from './pages/Reports';
import Settings    from './pages/Settings';
import Compliance  from './pages/Compliance';
import Webhooks    from './pages/Webhooks';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div
          style={{
            display: 'flex',
            width: '100%',
            minHeight: '100vh',
            background: 'var(--bg-app)',
          }}
        >
          <Sidebar />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <Header />
            <main
              style={{
                flex: 1,
                overflowY: 'auto',
                background: 'var(--bg-app)',
              }}
            >
              <Routes>
                <Route path="/"             element={<Overview />}     />
                <Route path="/ai-systems"   element={<AISystems />}    />
                <Route path="/aibom"        element={<AIBOM />}        />
                <Route path="/supply-chain" element={<SupplyChain />}  />
                <Route path="/agents"       element={<AgentsMCP />}    />
                <Route path="/rag"          element={<RAGLineage />}   />
                <Route path="/findings"     element={<Findings />}     />
                <Route path="/attack-paths" element={<AttackPaths />}  />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/reports"      element={<Reports />}      />
                <Route path="/settings"     element={<Settings />}     />
                <Route path="/compliance"   element={<Compliance />}   />
                <Route path="/webhooks"     element={<Webhooks />}     />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
