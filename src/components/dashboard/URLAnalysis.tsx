"use client";

import { useState } from "react";

type URLAnalysisProps = {
    onIPResolved: (ip: string) => void;

    onSSLDataChange: (
        data: {
            issuer: string;
            expires: string;
            risk: string;
        }
    ) => void;
};

    export function URLAnalysis({
            onIPResolved,
            onSSLDataChange,
        }: URLAnalysisProps) {
    const [url, setUrl] = useState("");
    const [domain, setDomain] = useState("");
    const [resolvedIP, setResolvedIP] = useState("");
    const [whoisData, setWhoisData] = useState<any>(null);
    const [sslData, setSslData] = useState<any>(null);

    function extractDomain(input: string) {
        try {
            const parsedUrl = new URL(input);

            return parsedUrl.hostname
            .replace("www.", "");

        } catch {
                return "";
            }
    }

    function calculateDomainAge(created: string) {

        if (
            !created ||
            created === "N/A"
        ) {
            return 0;
        }

        const createdDate = new Date(created);

        const now = new Date();

        return (
            now.getFullYear() -
            createdDate.getFullYear()
        );
    }   


    function getDomainRisk(age: number) {

        if (age === 0) {
            return "UNKNOWN";
        }

        if (age < 1) {
            return "HIGH";
        }

        if (age < 3) {
            return "MEDIUM";
        }

        return "LOW";
    }

    function getDaysRemaining(expirationDate: string) {       

        const expiry = new Date(expirationDate);


        const now = new Date();

        const diff =
            expiry.getTime() - now.getTime(); 


        return Math.floor(
            diff / (1000 * 60 * 60 * 24)
        );
    }

    function getSSLRisk(days: number) {

        if (days <= 30) {
            return "HIGH";
        }

        if (days <= 90) {
            return "MEDIUM";
        }

        return "LOW";
    }

    function getRiskBadgeColor(risk: string) {
        if (risk === "HIGH") {
            return "bg-red-500/20 text-red-400";
        }

        if (risk === "MEDIUM") {
            return "bg-yellow-500/20 text-yellow-400";
        }

        if (risk === "UNKNOWN") {
            return "bg-slate-500/20 text-slate-300";
        }

        return "bg-green-500/20 text-green-400";
    }

    function getSSLRiskColor(risk: string) {

        if (risk === "HIGH") {
            return "bg-red-500/20 text-red-400";
        }

        if (risk === "MEDIUM") {
            return "bg-yellow-500/20 text-yellow-400";
        }

        return "bg-green-500/20 text-green-400";
    }

    function formatDate(dateString: string) {
        return new Date(dateString)
            .toLocaleDateString("pt-BR");
    }

    async function handleAnalyze() {
        const extracted = extractDomain(url);

        setDomain(extracted);

        if (!extracted) return;

        try {
                const response = await fetch(
                `/api/dns?domain=${extracted}`
            );

            const result = await response.json();

            setResolvedIP(result.ip);
            onIPResolved(result.ip);

            const whoisResponse = await fetch(
                `/api/whois?domain=${extracted}`
            );

            const whoisResult =
                await whoisResponse.json();

            setWhoisData(whoisResult); 

            const sslResponse = await fetch(
                `/api/ssl?domain=${extracted}`
            );

            const sslResult =
                await sslResponse.json();

            setSslData(sslResult);

            onSSLDataChange({
                issuer: sslResult.issuer,
                expires: sslResult.validTo,
                    risk: getSSLRisk(
                        getDaysRemaining(
                            sslResult.validTo
                        )
                    ),
            });

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="bg-[#0B1020]/80 border border-slate-700/50 rounded-2xl p-6 mt-10">

            <h3 className="text-xl font-semibold">
                URL Analysis
            </h3>

            <p className="text-slate-400 text-sm mt-2">
                Analyze domains and URLs
            </p>

            <div className="mt-6 flex gap-4">

                <input
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-[#060816] border border-slate-700 rounded-xl px-4 py-3 outline-none"
                />

                <button
                    onClick={handleAnalyze}
                    className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl font-medium"
                >
                    Analyze
                </button>
            </div>

            {domain && (
                <div className="mt-6 bg-[#060816] rounded-xl p-4 border border-slate-800">

                    <h4 className="font-semibold mb-3">
                        Domain Extracted
                    </h4>

                    <p>
                        {domain}
                    </p>
                </div>
            )}

            {resolvedIP && (
                <div className="mt-4 bg-[#060816] rounded-xl p-4 border border-slate-800">

                    <h4 className="font-semibold mb-3">
                        Resolved IP
                    </h4>

                    <p>
                        {resolvedIP}
                    </p>
                </div>
            )}

            {whoisData && (
                <div className="mt-4 bg-[#060816] rounded-xl p-4 border border-slate-800">

                    <h4 className="font-semibold mb-3">
                        Domain Intelligence
                    </h4>

                    <p>
                        <strong>Registrar:</strong>{" "}
                        {whoisData.registrar}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {whoisData.created}
                    </p>

                    <p>
                        <strong>Expires:</strong>{" "}
                        {whoisData.expires}
                    </p>
                    
                    <p>
                        <strong>Domain Age:</strong>{" "}
                        {calculateDomainAge(whoisData.created)} years
                    </p>

                    <div className="mt-2">
                        <span className="font-semibold">
                            Domain Risk:
                        </span>

                        <span
                            className={`
                                ml-2 px-3 py-1 rounded-full text-xs font-bold
                                ${getRiskBadgeColor(
                                    getDomainRisk(
                                        calculateDomainAge(
                                            whoisData.created
                                        )
                                    )
                                )}
                            `}
                        >
                            {getDomainRisk(
                                calculateDomainAge(
                                    whoisData.created
                                )
                            )}
                        </span>
                    </div>

                </div>
            )}
            
            {sslData && (
                <div className="mt-4 bg-[#060816] rounded-xl p-4 border border-slate-800">

                    <h4 className="font-semibold mb-3">
                        SSL Intelligence
                    </h4>

                    <p>
                        <strong>Status:</strong>{" "}
                        {sslData.valid ? "Valid" : "Invalid"}
                    </p>

                    <p>
                        <strong>Issuer:</strong>{" "}
                        {sslData.issuer}
                    </p>

                    <p>
                        <strong>Expires:</strong>{" "}
                        {formatDate(sslData.validTo)}
                    </p>

                    <p>
                        <strong>Days Remaining:</strong>{" "}
                        {getDaysRemaining(sslData.validTo)}
                    </p>

                    <div className="mt-2">

                        <span className="font-semibold">
                            SSL Risk:
                        </span>

                        <span
                            className={`
                                ml-2 px-3 py-1 rounded-full text-xs font-bold
                                ${getSSLRiskColor(
                                    getSSLRisk(
                                        getDaysRemaining(
                                            sslData.validTo
                                        )
                                    )
                                )}
                            `}
                        >
                            {getSSLRisk(
                                getDaysRemaining(
                                    sslData.validTo
                                )
                            )}
                        </span>

                    </div>

                </div>
            )}
        </div>
    );
}