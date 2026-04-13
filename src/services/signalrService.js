import * as signalR from "@microsoft/signalr";

let connection = null;

export const startSignalRConnection = async () => {

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5214/proposalHub")
    .withAutomaticReconnect()
    .build();

  try {

    await connection.start();
    console.log("SignalR connected");

  } catch (err) {

    console.error("SignalR connection failed", err);

  }
};

export const onProposalViewed = (callback) => {

  if (!connection) return;

  connection.on("ProposalViewed", callback);
};