import * as signalR from "@microsoft/signalr";
import { API_BASE_Invoice } from "../config/api";

let connection = null;

export const startSignalRConnection = async () => {

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_Invoice}/proposalHub`)
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