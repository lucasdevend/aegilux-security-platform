"use client";

import { useEffect, useState } from "react";

type SearchHistoryItem = {
    ip: string;
    country: string;
    isp: string;
};

type IPData = {
    ip?: string;
    country?: string;
    city?: string;

    connection?: {
        isp?: string;
        org?: string;
        asn?: number;
    };

    latitude?: number;
    longitude?: number;
};


type IPAnalysisProps = {
    selectedIP: string;

    onThreatScoreChange: (
        score: number
    ) => void;

    sslInfo: {
        issuer: string;
        expires: string;
        risk: string;
    };
};


    export function IPAnalysis({
        selectedIP,
        onThreatScoreChange,
        sslInfo,
    }: IPAnalysisProps){

    const [ip, setIp] = useState("");
    const [data, setData] = useState<IPData | null>(null);
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [threatScore, setThreatScore] = useState(0);

    function getRiskLevel(score: number) {
        if (score >= 60) return "HIGH";
        if (score >= 30) return "MEDIUM";
        return "LOW";
    }

    function getRiskColor(score: number) {
        if (score >= 60) return "bg-red-500";
        if (score >= 30) return "bg-yellow-500";
        return "bg-green-500";
    }

    useEffect(() => {
        if (!selectedIP) return;

        setIp(selectedIP);

        analyzeIP(selectedIP);

    }, [selectedIP]);

    function isValidIP(ip: string) {
        const regex =
            /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
        return regex.test(ip);
    }

    function calculateThreatScore(result: IPData) {

        let score = 0;

        const isp =
            (result.connection?.isp || "")
                .toLowerCase();

        const org =
            (result.connection?.org || "")
                .toLowerCase();

        if (
            isp.includes("hosting") ||
            isp.includes("datacenter") ||
            isp.includes("cloud")
        ) {
            score += 25;
        }

        if (
            org.includes("vpn") ||
            org.includes("proxy")
        ) {
            score += 30;
        }

        if (!result.country) score += 20;

        if (!result.connection?.asn)
            score += 15;

        if (!result.connection?.org)
            score += 10;

        return Math.min(score, 100);
    }


    async function analyzeIP(targetIP: string) {
        try {
            setLoading(true);

            const response = await fetch(
                `https://ipwho.is/${targetIP}`
            );

            const result = await response.json();

            console.log("IPWHOIS RESULT:", result);

            setData(result);

            const score = calculateThreatScore(result);

                setThreatScore(score);
                onThreatScoreChange(score);

            setHistory((prev) => [
                {
                    ip: result.ip,
                    country: result.country,
                    isp: result.connection?.isp || "Unknown",
                },
                ...prev,
            ]);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

        async function handleAnalyze() {

            if (!isValidIP(ip)) {
                alert("Please enter a valid IPv4 address.");
                return;
            }

            await analyzeIP(ip);
        }


    function exportCSV() {
        const headers = ["IP", "Country", "ISP"];

        const rows = history.map((item) => [
            item.ip,
            item.country,
            item.isp,
        ]);

        const csvContent = [
            headers,
            ...rows,
        ]
        .map((row) => row.join(","))
        .join("\n");

        const blob = new Blob(
            [csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "aegilux-history.csv";

        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <div className="bg-[#0B1020]/80 border border-slate-700/50 rounded-2xl p-6 mt-10">

            <h3 className="text-xl font-semibold">
                IP Analysis
            </h3>

            <p className="text-slate-400 text-sm mt-2">
                Analyze IP reputation and infrastructure data
            </p>

            <div className="mt-6 flex gap-4">

                <input
                    type="text"
                    placeholder="Enter IP address..."
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="flex-1 bg-[#060816] border border-slate-700 rounded-xl px-4 py-3 outline-none"
                />

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="
                        px-6 py-3 rounded-xl font-medium transition
                        bg-blue-500 hover:bg-blue-600
                        disabled:bg-slate-700
                        disabled:cursor-not-allowed
                    "
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>

            {data && (
                <div className="mt-6 bg-[#060816] rounded-xl p-4 border border-slate-800">

                    <h4 className="font-semibold mb-4">
                        Analysis Result
                    </h4>

                    <div className="mb-4">

                        <p className="text-sm text-slate-400">
                            Threat Score
                        </p>

                        <div className="flex items-center gap-3 mt-2">

                            <div className="w-full bg-slate-800 rounded-full h-3">

                                <div
                                    className={`${getRiskColor(threatScore)} h-3 rounded-full`}
                                    style={{
                                        width: `${threatScore}%`,
                                    }}
                                />

                            </div>

                            <div className="flex flex-col items-end">

                                <span className="font-bold">
                                    {threatScore}
                                </span>

                                <span className="text-xs text-slate-400">
                                    {getRiskLevel(threatScore)}
                                </span>

                            </div>

                        </div>
                </div>

                    <div className="space-y-2 text-sm">

                        <p>
                            <strong>IP:</strong> {data.ip}
                        </p>

                        <p>
                            <strong>Country:</strong> {data.country}
                        </p>

                        <p>
                            <strong>City:</strong> {data.city}
                        </p>

                        <p>
                            <strong>ISP:</strong> {data.connection?.isp}
                        </p>

                        <p>
                            <strong>Organization:</strong> {data.connection?.org}
                        </p>

                        <p>
                            <strong>ASN:</strong> {data.connection?.asn}
                        </p>

                        <p>
                            <strong>Latitude:</strong> {data.latitude}
                        </p>

                        <p>
                            <strong>Longitude:</strong> {data.longitude}
                        </p>
                    </div>

                </div>
            )}

            {history.length > 0 && (
                <div className="mt-6 bg-[#060816] rounded-xl p-4 border border-slate-800">

                    <h4 className="font-semibold mb-4">
                        Recent Searches
                    </h4>

                    <button
                        onClick={exportCSV}
                        className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                    >
                        Export CSV
                    </button>

                <button
                        onClick={async () => {

                        if (!data) {
                            alert("Analyze an IP first");
                            return;
                        }


                        const response = await fetch(
                            "/api/report",
                            {
                            method: "POST",
                                headers: {
                                    "Content-Type":
                                    "application/json",
                                },
                                body: JSON.stringify({
                                    ip: data.ip,
                                    country: data.country,
                                    isp: data.connection?.isp,
                                    threatScore,

                                    sslIssuer:
                                        sslInfo.issuer,

                                    sslExpires:
                                        sslInfo.expires,

                                    sslRisk:
                                        sslInfo.risk,
                                }),
                            }
                        );

                        const blob =
                            await response.blob();

                        const url =
                            window.URL.createObjectURL(blob);

                        const a =
                            document.createElement("a");

                        a.href = url;
                        a.download =
                            "aegilux-report.pdf";

                            a.click();

                        window.URL.revokeObjectURL(
                            url
                        );
                    }}
                        className="
                        px-4 py-2
                        bg-blue-600
                        hover:bg-blue-700
                        rounded-lg
                        text-sm ">
                        Generate Report
                </button>

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>
                                <tr className="text-left border-b border-slate-700">
                                    <th className="pb-2">IP</th>
                                    <th className="pb-2">Country</th>
                                    <th className="pb-2">ISP</th>
                                </tr>
                            </thead>

                            <tbody>
                                {history.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-slate-800"
                                    >
                                        <td className="py-2">{item.ip}</td>
                                        <td>{item.country}</td>
                                        <td>{item.isp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}