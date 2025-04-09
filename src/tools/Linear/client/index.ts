import { LinearClient } from "@linear/sdk";
import axios from "axios";

export const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_ACCESS_TOKEN,
});

export const linearAxiosClient = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.LINEAR_ACCESS_TOKEN}`,
  },
});
