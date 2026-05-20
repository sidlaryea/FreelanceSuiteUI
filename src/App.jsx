// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your current content moved here
import Register from './Register'; // New signup page
import Login from './login'; // New login page
import Dashboard from './Dashboard2'; // New dashboard page
import CreateInvoice from './Create-invoice'; // New create invoice page
import InvoiceDashboardPage from './InvoicedashboardPage'; // New invoice dashboard page
import DashboardLayout from './components/DashboardLayout'; // New dashboard layout component
import CustomerRegistrationForm from './CustomerRegistrationPage';
import GenerateInvoicePage from './GenerateInvoicePage'; // New create invoice page
import PaymentPage from './PaymentPage';
import CompleteSetup from './CompleteSetup'; // New complete setup page
import ProductItemPage from './ProductItemPage'; // New inventory management page
import UpgradePage from './UpgradePage';
import PaymentVerify from './components/PaymentVerify';
import ExpensePage from './Expense';
import RecurringInvoicePage from './RecurringInvoice';
import TrackDelivery from './Trackdelivery';
import SettingsPage from './SettingsPage';

import TaxPage from './taxpage';
import AuditPage from './AuditPage';
import ReportPage from './ReportPage';
import OnboardPage from './CompleteSetup2';
import PublicProposalPage from "./PublicProposalPage";
import ProjectOverviewPage from "./ProjectOverviewPage";
import ProjectOverviewPreviewPage from "./ProjectOverviewPreviewPage";
import ProposalDraftEditorPage from './ProposalDraftEditorPage';
import ProposalDraftPage from './ProposalDraftPage';
import ClientSignaturePage from './ClientSignaturePage';
import InternalPreviewPage from './components/InternalPreviewPage';
import FinalProposalPage from './FinalProposalPage';
import ClientProposalPage from './ClientProposalPage';
import ClientPaymentPage from './ClientPaymentPage';
import ProposalSettingspage from './ProposalSettingspage';
import ClientsPage from './ClientsPage';








function App() {
  
  

  return (
    
      <Router basename="/FreelanceLandingPage">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />{/* DashboardPage*/}
          {/* Public Proposal */}
        <Route path="/proposal/:token" element={<PublicProposalPage />} />
        <Route path="/preview/:draftId" element={<InternalPreviewPage />} />
        <Route path="/clientspage" element={<ClientsPage />} />
        








          <Route path="/invoicedashboard" element={<InvoiceDashboardPage />} /> {/* Redirect to Dashboard for /invoicedashboard */}
          <Route path="/create-invoice" element={<CreateInvoice />} /> {/* Redirect all other paths to Home */}
          <Route path="/DashboardLayout" element={<DashboardLayout />} />
          <Route path="/customer" element={<CustomerRegistrationForm />} /> {/* Redirect all other paths to Home */}
          <Route path="/invoices" element={<GenerateInvoicePage />} /> {/* Redirect to Create Invoice*/}
          <Route path="/payment" element={<PaymentPage/>}/>
          <Route path="/complete-setup" element={<CompleteSetup/>} /> {/* Redirect all other paths to Home */}
          <Route path="/ProductItemPage" element={<ProductItemPage />} /> {/* New inventory management page */}
          <Route path="/UpgradePage" element={<UpgradePage />} /> {/* New inventory management page */}
          <Route path="/paymentverify" element={<PaymentVerify  />} /> {/* Redirect all other paths to Home */}
          <Route path="/expense" element={<ExpensePage  />} /> {/* Redirect all other paths to Home */}
          <Route path="/recurringInvoice" element={<RecurringInvoicePage  />} /> {/* Redirect all other paths to Home */}
          <Route path="/trackDelivery" element={<TrackDelivery />} /> 
          <Route path="/Settings" element={<SettingsPage />} /> {/* Redirect all other paths to Home */}
          <Route path="/ProposalSettings" element={<ProposalSettingspage />} />
          <Route path="/Taxpage" element={<TaxPage />} /> {/* Redirect all other paths to Home */}
          <Route path="/AuditPage" element={<AuditPage />} /> {/* Redirect all other paths to Home */}
          <Route path="ReportPage" element={<ReportPage />} /> {/* Redirect all other paths to Home */}
          <Route path="/OnboardPage" element={<OnboardPage />} /> {/* Redirect all other paths to Home */}
          <Route path="/ProjectOverviewPage" element={<ProjectOverviewPage />} /> {/* Redirect all other paths to Home */}
          <Route path="/ProjectOverviewPreviewPage/:id" element={<ProjectOverviewPreviewPage />} />
          <Route path="/ProposalDraftPage" element={<ProposalDraftPage />} />
          <Route path="/ProposalDraftEditorPage/:id" element={<ProposalDraftEditorPage />} />
          <Route path="/final-proposal/:id" element={<FinalProposalPage />} />
          <Route path="/proposal/view/:publicId" element={<ClientSignaturePage />} />
          <Route path="/client/proposal/:token" element={<ClientProposalPage />} />
          <Route path="/client/payment/:token" element={<ClientPaymentPage />} />
          

          <Route path="*" element={<Home />} /> {/* Redirect all other paths to Home */}


        </Routes>
        
      </Router>
      
    
  );
}

export default App;
