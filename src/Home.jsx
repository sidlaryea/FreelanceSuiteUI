import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
  ChevronRight,
  Check,
  Zap,
  FileText,
  CreditCard,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Menu,
  X
} from 'lucide-react';

export default function FreelanceSuiteLanding() {
  // const [email, ] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartTrial = (e) => {
    e.preventDefault();
    // alert(`Starting free trial for: ${email}`);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* NAVIGATION */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br flex items-center justify-center">
              <img src='./logo.png' alt="Logo" className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              FreelancePro Suite
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Start Free
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
            <a 
              href="#features" 
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={closeMobileMenu}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={closeMobileMenu}
            >
              Pricing
            </a>
            <button 
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={closeMobileMenu}
            >
              Start Free
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            From Client Inquiry to Payment —
            <br />
            <span className="text-blue-200">
              Completely Automated.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Stop writing proposals from scratch, copying data into invoices,
            and chasing payments. FreelancePro automates your entire workflow —
            so you can focus on client work, not admin.
          </p>

          <form
            onSubmit={handleStartTrial}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              required
            /> */}
            <button onClick={() => navigate('/Registration')} 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition cursor-pointer">
              Start Free — No Credit Card
            </button>
          </form>

          <p className="text-blue-200 mt-4 text-sm">
            14-day free trial • Cancel anytime
          </p>

          {/* PRODUCT MOCKUP PLACEHOLDER */}
          <div className="mt-16 bg-white/10 rounded-2xl p-6 backdrop-blur">
            <div className="bg-white rounded-xl h-64 flex items-center justify-center text-gray-500">
              Product Dashboard Preview (Insert Screenshot Here)
            </div>
          </div>

        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-10">
            Still Doing This Manually?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="flex gap-4">
              <Clock className="text-red-500 mt-1" />
              <p className="text-gray-700">
                Writing proposals from scratch every time.
              </p>
            </div>

            <div className="flex gap-4">
              <FileText className="text-red-500 mt-1" />
              <p className="text-gray-700">
                Copying project details into invoices manually.
              </p>
            </div>

            <div className="flex gap-4">
              <TrendingUp className="text-red-500 mt-1" />
              <p className="text-gray-700">
                Chasing late payments and tracking status in spreadsheets.
              </p>
            </div>

            <div className="flex gap-4">
              <Users className="text-red-500 mt-1" />
              <p className="text-gray-700">
                Endless back-and-forth emails with clients.
              </p>
            </div>
          </div>

          <p className="mt-10 text-xl text-gray-600">
            FreelancePro connects everything into one seamless system.
          </p>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="text-center">
              <Users className="mx-auto mb-4 text-blue-600" size={40} />
              <h3 className="text-xl font-bold mb-2">Client Inquiry</h3>
              <p className="text-gray-600">
                Collect all project details through smart intake forms.
              </p>
            </div>

            <div className="text-center">
              <Zap className="mx-auto mb-4 text-purple-600" size={40} />
              <h3 className="text-xl font-bold mb-2">AI Proposal</h3>
              <p className="text-gray-600">
                Generate professional proposals instantly.
              </p>
            </div>

            <div className="text-center">
              <CreditCard className="mx-auto mb-4 text-green-600" size={40} />
              <h3 className="text-xl font-bold mb-2">Get Paid</h3>
              <p className="text-gray-600">
                Auto-create invoices and accept payments seamlessly.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Everything You Need — Nothing You Don't
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <Feature icon={<Zap />} title="AI Proposals">
              Generate tailored proposals in seconds.
            </Feature>

            <Feature icon={<FileText />} title="Automated Invoicing">
              No manual data entry after approval.
            </Feature>

            <Feature icon={<CreditCard />} title="Integrated Payments">
              Accept cards & transfers instantly.
            </Feature>

            <Feature icon={<TrendingUp />} title="Real-Time Tracking">
              Know exactly who has paid.
            </Feature>

            <Feature icon={<Shield />} title="Secure & Compliant">
              Enterprise-level encryption & security.
            </Feature>

            <Feature icon={<Users />} title="Client Management">
              All client info in one place.
            </Feature>

          </div>

        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            Simple, Transparent Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <PricingCard
              title="Starter"
              price="$0"
              features={[
                "3 Proposals / month",
                "Basic Invoicing",
                "5% Transaction Fee"
              ]}
            />

            <PricingCard
              title="Pro"
              price="$29"
              highlight
              features={[
                "Unlimited Proposals",
                "AI Generation",
                "Automated Invoicing",
                "2% Transaction Fee"
              ]}
            />

            <PricingCard
              title="Business"
              price="$79"
              features={[
                "Team Access",
                "Custom Branding",
                "Advanced Reporting"
              ]}
            />

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Stop Wasting Time on Admin?
          </h2>
          <p className="mb-10 text-blue-100">
            Join freelancers and consultants who automate their workflow
            and get paid faster.
          </p>

          <button 
          onClick={() => navigate('/Registration')}
          className="cursor-pointer px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
            Start Free — No Credit Card
          </button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img src="./logo.png" alt="InvoiceAPI Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">FreeLancePro Suite by SidConsult</span>
            </div>
            <p className="text-gray-400 mb-6">&copy; 2025 FreeLancePro Suite. Powered By Sidconsult. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}


/* COMPONENTS */

function Feature({ icon, title, children }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  );
}

function PricingCard({ title, price, features, highlight }) {
  const navigate = useNavigate();
  return (
    <div className={`p-8 rounded-2xl border ${highlight ? 'border-blue-600 shadow-lg' : 'border-gray-200'}`}>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="text-4xl font-bold mb-6">
        {price}
        <span className="text-lg text-gray-500"> /month</span>
      </div>

      <ul className="space-y-3 mb-8 text-gray-600">
        {features.map((f, i) => (
          <li key={i}>✓ {f}</li>
        ))}
      </ul>

      <button onClick={() => navigate('/Registration')}
        className={`w-full py-3 cursor-pointer rounded-lg font-semibold ${
          highlight
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}>
        Start Free
      </button>
    </div>
  );
}
