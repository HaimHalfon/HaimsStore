import React, { useState } from "react";
import MyBubble from "./MyBubble";

function MyList({ items = [], handlers = {}, myKey = "list" }) {
	const [editingId, setEditingId] = useState(-1);
	const [hoverId, setHoverId] = useState(-1);
	const [bubbleContent, setBubbleContent] = useState({});
	const [inputValue, setInputValue] = useState("");

	const onDeleteItem = (id) => {
		handlers.deleteItem(id);
		setEditingId(-1);
		setInputValue("");
	};

	const onUpdateItem = (id, value) => {
		handlers.updateItem(id, value);
		setEditingId(-1);
		setInputValue("");
	};

	const onOverItem = (id) => {
		setHoverId(id);
		setBubbleContent(handlers.overItem(id));
	};

	const onOutItem = () => {
		setHoverId(-1);
		setBubbleContent({});
	};

	return (
		<ul className="list-group border-0">
			{items.map((item, index) => (
				<li key={`${myKey}-${index}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div className="bubble-wrapper w-50" onMouseOver={() => onOverItem(item.id)} onMouseOut={onOutItem}>
						{editingId !== item.id ? (
							<span>{item.value}</span>
						) : (
							<input className="form-control myStyle-animit-right" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
						)}
					</div>

					{hoverId === item.id && (
						<MyBubble fields={bubbleContent.fields} items={bubbleContent.items} myKey={bubbleContent.myKey} position={index < items.length / 2 ? "top-100" : "bottom-100"} />
					)}

					<div className="my-1">
						{editingId === item.id && (
							<>
								<button
									className="btn btn-sm btn-outline-danger myStyle-animit-left"
									onClick={(e) => {
										e.stopPropagation();
										onDeleteItem(item.id);
									}}
									title="Delete"
								>
									<i className="bi bi-trash"></i>
								</button>

								<button
									className="btn btn-sm btn-outline-primary ms-2 myStyle-animit-left"
									onClick={(e) => {
										e.stopPropagation();
										onUpdateItem(item.id, inputValue);
									}}
									title="Save"
								>
									<i className="bi bi-check-lg"></i>
								</button>
							</>
						)}

						<button
							className="btn btn-sm btn-outline-secondary ms-2"
							onClick={(e) => {
								e.stopPropagation();
								setEditingId(editingId === item.id ? -1 : item.id);
								setInputValue(editingId === item.id ? "" : item.value);
							}}
							title={editingId !== item.id ? "Edit" : "Cancel"}
						>
							<i className={"bi " + (editingId !== item.id ? "bi-pencil-fill" : "bi-x")}></i>
						</button>
					</div>
				</li>
			))}
		</ul>
	);
}

export default MyList;
