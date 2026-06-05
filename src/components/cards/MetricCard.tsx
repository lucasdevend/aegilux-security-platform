type MetricCardProps = {
    title: string;
    value: string;
    danger?: boolean;
};

export function MetricCard({
        title,
        value,
        danger = false,
    }: MetricCardProps) {
    return (
        <div className="bg-[#0B1020]/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/20 rounded-2xl p-6">

            <p className="text-slate-400 text-sm">
                {title}
            </p>

            <h3
                className={`text-4xl font-bold mt-4 ${
                    danger ? "text-red-400" : "text-white"
                }`}
            >
                {value}
            </h3>
        </div>
    );
}