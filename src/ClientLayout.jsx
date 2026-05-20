import ClientSidebar from "./components/ClientSidebar";
import ClientTopbar from "./components/ClientTopbar";


export default function ClientLayout({ children, proposal }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <ClientSidebar proposal={proposal} />
       < div className="flex-1 flex flex-col">
       {/* 🔷 TOP NAVBAR */}
        <ClientTopbar proposal={proposal} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
      </div>
    </div>
  );
}