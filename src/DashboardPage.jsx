import ActivityFeed from "../../components/dashboard/ActivityFeed";

export default function DashboardPage() {

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        <ActivityFeed />

      </div>

    </div>

  );
}