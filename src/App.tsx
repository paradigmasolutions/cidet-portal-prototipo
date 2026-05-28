import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ResumenPage } from './pages/ResumenPage'
import { PortafolioPage } from './pages/PortafolioPage'
import { CertificadosPage } from './pages/CertificadosPage'
import { CertificadoDetallePage } from './pages/CertificadoDetallePage'
import { ProcesosPage } from './pages/ProcesosPage'
import { PreofertaPage } from './pages/PreofertaPage'
import { DocumentosPage } from './pages/DocumentosPage'
import { ContactoPage } from './pages/ContactoPage'
import { LoginPage } from './pages/LoginPage'
import { UsuariosPage } from './pages/admin/UsuariosPage'
import { AlertasPage } from './pages/admin/AlertasPage'
import { LogsPage } from './pages/admin/LogsPage'
import { PerfilPage } from './pages/admin/PerfilPage'
import { I18nProvider } from './i18n'

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<ResumenPage />} />
            <Route path="portafolio" element={<PortafolioPage />} />
            <Route path="certificados" element={<CertificadosPage />} />
            <Route path="certificados/:numero" element={<CertificadoDetallePage />} />
            <Route path="procesos" element={<ProcesosPage />} />
            <Route path="preoferta" element={<PreofertaPage />} />
            <Route path="documentos" element={<DocumentosPage />} />
            <Route path="contacto" element={<ContactoPage />} />
            <Route path="admin/usuarios" element={<UsuariosPage />} />
            <Route path="admin/alertas" element={<AlertasPage />} />
            <Route path="admin/logs" element={<LogsPage />} />
            <Route path="admin/perfil" element={<PerfilPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App
