import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";

const COLORS = [
	"#36A2EB",
	"#FFCE56",
	"#4BC0C0",
	"#9966FF",
	"#FF9F40",
	"#66BB6A",
	"#FF6B6B",
	"#00C49F",
	"#F78DA7",
	"#FFD700",
	"#7FDBFF",
	"#AF7AC5",
	"#F39C12",
	"#5DADE2",
	"#58D68D",
	"#E67E22",
	"#C0392B",
	"#FF6384",
];

function MyChart({ type = "pie", data = [], barName = "Quantity" }) {
	if (data.length === 0)
		return (
			<ResponsiveContainer width="100%" height={500}>
				No Data
			</ResponsiveContainer>
		);

	const dataSort = useMemo(() => [...data].sort((a, b) => a.value - b.value), [data]);

	if (type === "pie") {
		return (
			<ResponsiveContainer width="100%" height={500}>
				<PieChart>
					<Pie data={dataSort} dataKey="value" labelLine={false} outerRadius={110} label={({ value }) => value}>
						{dataSort.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							fontSize: "12px",
							padding: "4px",
							backgroundColor: "#fff",
							border: "1px solid #ccc",
						}}
					/>
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		);
	} else {
		const yTicks = useMemo(() => {
			const maxValue = dataSort[dataSort.length - 1]?.value || 0;
			return Array.from({ length: maxValue + 1 }, (_, i) => i);
		}, [dataSort]);

		return (
			<ResponsiveContainer width="100%" height={500}>
				<BarChart data={dataSort}>
					<CartesianGrid strokeDasharray="1 1" />
					<XAxis dataKey="name" />
					<YAxis ticks={yTicks} />
					<Tooltip />
					<Legend />
					<Bar dataKey="value" fill="#36A2EB" name={barName}>
						<LabelList dataKey="value" position="top" />
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		);
	}
}

export default MyChart;
