import { useEffect, useState } from "react";
import { startSignalRConnection, onProposalViewed } from "../../services/signalrService";

export default function ActivityFeed() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {

    const initSignalR = async () => {

      await startSignalRConnection();

      onProposalViewed((data) => {

        const newActivity = {
          type: "view",
          title: data.proposalTitle,
          browser: data.browser,
          device: data.device,
          time: new Date().toLocaleTimeString()
        };

        setActivities(prev => [newActivity, ...prev]);

      });

    };

    initSignalR();

  }, []);

  return (

    <div className="bg-white shadow rounded-xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.length === 0 && (
          <p className="text-gray-500">
            No activity yet
          </p>
        )}

        {activities.map((activity, index) => (

          <div key={index} className="border-b pb-3">

            <p className="font-medium">
              👁 Proposal Viewed
            </p>

            <p className="text-gray-600">
              {activity.title}
            </p>

            <p className="text-sm text-gray-400">
              {activity.device} • {activity.browser}
            </p>

            <p className="text-xs text-gray-400">
              {activity.time}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}