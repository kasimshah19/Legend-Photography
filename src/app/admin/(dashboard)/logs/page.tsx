import React from "react";
import { Metadata } from "next";
import AuditLogsClient from "./client";

export const metadata: Metadata = {
  title: "Audit Logs | Legend Photography Admin",
};

export default function AuditLogsPage() {
  return <AuditLogsClient />;
}
