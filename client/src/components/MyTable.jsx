function MyTable({ fields = [], items = [], myKey = "table" }) {
	if (items.length === 0) return <div>No Data</div>;

	return (
		<div className="table-responsive px-0">
			<table className="table table-bordered text-center" style={{ minWidth: "max-content" }}>
				<thead className="table-primary">
					<tr key={`${myKey}-tr-H`}>
						{fields.map(({ label }, index) => (
							<th key={`${myKey}-th-${index}`} className="nowrap">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{items.map((item, indexR) => (
						<tr key={`${myKey}-tr-${indexR}`}>
							{fields.map(({ key, nestedKey, render }, indexC) => (
								<td key={`${myKey}-td-${indexR}-${indexC}`} className="nowrap">
									{render ? render(item[key], item.id) : nestedKey ? item[key][nestedKey] : item[key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default MyTable;
