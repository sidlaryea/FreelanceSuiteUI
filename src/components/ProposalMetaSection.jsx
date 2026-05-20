export default function ProposalMetaSection({ userData, client, overview }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-2 text-sm text-slate-700">
      
      <p><strong>Project:</strong> {overview?.title ||overview?.projectTitle }</p>
      
      <p><strong>Prepared By:</strong> {userData?.name}</p>
      <p><strong>Address:</strong> {userData?.address}</p>
      <p><strong>Email:</strong> {userData?.email}</p>
      <p><strong>Phone:</strong> {userData?.phone}</p>

      <hr className="my-3"/>

      <p><strong>Prepared For:</strong> {client?.name}</p>
      <p><strong>Company:</strong> {client?.company || client.companyName}</p>
      <p><strong>Address:</strong> {client?.address}</p>
      <p><strong>Email:</strong> {client?.email}</p>
      <p><strong>Phone:</strong> {client?.phone}</p>
      

    </div>
  );
  
}
