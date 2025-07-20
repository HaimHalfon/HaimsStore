import React, { useState, useMemo } from "react";

function MyForm({
	inputs = [], // { name, label, type, value, required, disabled, selectOptions, min, max, unitSymbol },
	handleSubmit,
	handleChange,
	buttons = [], // { type, title, color, handle, disabled }
	myKey = "form",
	showCancelButton = false,
	horizontally = false,
}) {
	// ערך התחלתי לכל השדות בטופס
	const initialFormData = useMemo(() => {
		return inputs.reduce((acc, input) => {
			if (input.value !== undefined && input.value !== null) acc[input.name] = input.value;
			else acc[input.name] = input.type === "number" || input.type === "range" ? input.min || 0 : input.type === "checkbox" ? false : "";
			return acc;
		}, {});
	}, []);

	const [formData, setFormData] = useState(initialFormData);
	const [isTypingStarted, setIsTypingStarted] = useState(false);

	// פונקציה שמאתחלת את כל הטופס לערך ההתחלתי
	const initForm = () => {
		setFormData(initialFormData);
		handleChange && handleChange(initialFormData);
		setIsTypingStarted(false);
	};

	// פונקציה שמאפסת את כל השדות בטופס
	const resetForm = () => {
		const clearedFormData = inputs.reduce((acc, input) => {
			acc[input.name] = input.type === "number" || input.type === "range" ? input.min || 0 : input.type === "checkbox" ? false : "";
			return acc;
		}, {});
		setFormData(clearedFormData);
		handleChange && handleChange(clearedFormData);
	};

	const handleChangeInternal = (e) => {
		if (!isTypingStarted) setIsTypingStarted(true);

		const { name, value, type, checked } = e.target;
		const newValue = type === "number" || type === "range" ? +value : type === "checkbox" ? checked : value;

		const updatedFormData = { ...formData, [name]: newValue };
		setFormData(updatedFormData);
		handleChange && handleChange(updatedFormData);
	};

	const handleSubmitInternal = async (e) => {
		e.preventDefault();
		if (handleSubmit) {
			const confirm = await handleSubmit(e, formData, resetForm);
			confirm !== "notConfirm" && setIsTypingStarted(false);
		}
	};

	return (
		<form className="px-0" onSubmit={handleSubmitInternal}>
			<div className={horizontally ? "row gx-md-2 gx-xl-5 gy-3 align-items-center" : "row gy-3"}>
				{inputs.map((input, index) => {
					const commonProps = {
						id: `${myKey}-${index}`,
						name: input.name,
						type: input.type,
						value: formData[input.name],
						required: input.required,
						disabled: input.disabled,
						onChange: handleChangeInternal,
					};

					switch (input.type) {
						case "text":
						case "password":
						case "email":
							return (
								<div className={horizontally ? "col-md" : ""} key={`${myKey}-${index}`}>
									<div className="input-group">
										<label className="input-group-text w-35" htmlFor={`${myKey}-${index}`}>
											{input.label}
										</label>
										<input className="form-control" {...commonProps} />
									</div>
								</div>
							);

						case "number":
							return (
								<div className={horizontally ? "col-md" : ""} key={`${myKey}-${index}`}>
									<div className="input-group">
										<label className="input-group-text w-35" htmlFor={`${myKey}-${index}`}>
											{input.label}
										</label>
										<input className="form-control" {...commonProps} min={input.min} max={input.max} />
									</div>
								</div>
							);

						case "checkbox":
							return (
								<div className={horizontally ? "col-md" : ""} key={`${myKey}-${index}`}>
									<div className="form-check">
										<input className="form-check-input" {...commonProps} checked={formData[input.name]} />
										<label className="form-check-label" htmlFor={`${myKey}-${index}`}>
											{input.label}
										</label>
									</div>
								</div>
							);

						case "switch":
							return (
								<div className={horizontally ? "col-md" : ""} key={`${myKey}-${index}`}>
									<div className="form-check form-switch">
										<input className="form-check-input" {...commonProps} type="checkbox" checked={formData[input.name]} />
										<label className="form-check-label" htmlFor={`${myKey}-${index}`}>
											{input.label}
										</label>
									</div>
								</div>
							);

						case "textarea":
							return (
								<div className={horizontally ? "col-md" : ""} key={`${myKey}-${index}`}>
									<div className="input-group">
										<label className="input-group-text w-35" htmlFor={`${myKey}-${index}`}>
											{input.label}
										</label>
										<textarea className="form-control" {...commonProps}></textarea>
									</div>
								</div>
							);

						case "select":
							return (
								<div className={horizontally ? "col-md" : ""} key={`${myKey}-${index}`}>
									<div className="input-group">
										<label className="input-group-text w-35" htmlFor={`${myKey}-${index}`}>
											{input.label}
										</label>
										<select className="form-select" {...commonProps}>
											{!commonProps.value && <option value="">Select...</option>}
											{input.selectOptions.map((option, indexOption) => (
												<option key={`${myKey}-${index}-${indexOption}`} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</div>
								</div>
							);

						case "range":
							return (
								<div className={horizontally ? "col-md" : ""} key={`${myKey}-${index}`}>
									<div className="d-flex align-items-center">
										<label htmlFor={`${myKey}-${index}`}>{input.label}</label>
										<input className="form-range flex-grow-1 mx-3" {...commonProps} min={input.min} max={input.max} />
										<span className="text-nowrap">{`${commonProps.value} ${input.unitSymbol}`}</span>
									</div>
								</div>
							);

						case "hidden":
							return <input key={`${myKey}-${index}`} {...commonProps} />;

						default:
							return null;
					}
				})}

				<div className={horizontally ? "col-md-auto" : ""}>
					<div className="d-flex justify-content-between">
						<div>
							{buttons.map((button, index) => (
								<button
									key={`${myKey}-${index}`}
									type={button.type}
									className={`btn btn-${button.color} w-auto me-2 mt-3 mt-md-0`}
									onClick={button.type !== "submit" ? () => button.handle(formData) : undefined}
									disabled={button.disabled}
								>
									{button.title}
								</button>
							))}
						</div>

						{showCancelButton && (
							<button className={`${isTypingStarted ? "" : "invisible"} btn btn-outline-secondary w-auto mt-3 mt-md-0`} type="button" onClick={initForm}>
								Cancel
							</button>
						)}
					</div>
				</div>
			</div>
		</form>
	);
}

export default MyForm;
