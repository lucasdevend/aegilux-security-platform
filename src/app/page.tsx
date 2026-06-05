"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard } from "@/components/cards/MetricCard";
import { IPAnalysis } from "@/components/dashboard/IPAnalysis";
import { URLAnalysis } from "@/components/dashboard/URLAnalysis";

export default function Home() {

  const [selectedIP, setSelectedIP] = useState("");
  const [currentThreatScore, setCurrentThreatScore] = useState(0);

  const [monitoredHosts] = useState(12);

  const [sslInfo, setSSLInfo] = useState({
      issuer: "",
      expires: "",
      risk: "",
    });


  return (
    <main className="min-h-screen bg-[#060816] text-white flex">

      <Sidebar />

      {/* CONTENT */}
      <section className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          
          <div>
            <h2 className="text-3xl font-bold">
              Security Dashboard
            </h2>

            <p className="text-slate-400 mt-2">
              Infrastructure monitoring & threat intelligence
            </p>
          </div>
        </div>

        {/* CARDS */}
          <div className="grid grid-cols-3 gap-6 mt-10">

              <MetricCard
                title="Threat Score"
                value={String(currentThreatScore)}
              />

              <MetricCard
                  title="Monitored Hosts"
                  value="12"
                />

              <MetricCard
                title="Active Alerts"
                value={
                  currentThreatScore >= 60
                  ? "1"
                  : "0"
                }
                danger={
                  currentThreatScore >= 60
                }
              />
          </div>

        <IPAnalysis
            selectedIP={selectedIP}
            onThreatScoreChange={
            setCurrentThreatScore
          }
          sslInfo={sslInfo}
        />
        <URLAnalysis
            onIPResolved={setSelectedIP}
            onSSLDataChange={setSSLInfo}
          />
      </section>

    </main>
  );
}