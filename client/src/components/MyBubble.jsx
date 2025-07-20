function MyBubble({ fields = [], items = [], position = "top-100", myKey = "bubble" }) {
	return (
		<div className={`bubble-popup ${position}`}>
			<table>
				<thead>
					<tr key={`${myKey}-tr-H`}>
						{fields.map(({ label }, index) => (
							<th key={`${myKey}-th-${index}`} className="nowrap text-warning pe-3 text-start">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{items.length === 0 ? (
						<tr className="pe-3 text-start">
							<td>No Data</td>
						</tr>
					) : (
						items.map((item, indexR) => (
							<tr key={`${myKey}-tr-${indexR}`}>
								{fields.map(({ key, render }, indexC) => (
									<td key={`${myKey}-td-${indexR}-${indexC}`} className="nowrap pe-3 text-start">
										{render ? render(item[key], item.id) : item[key]}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export default MyBubble;
