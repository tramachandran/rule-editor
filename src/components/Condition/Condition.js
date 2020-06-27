import React, { useState, useRef, useImperativeHandle, useEffect} from 'react';
import './Condition.scss';

function Condition(props, ref) {
    const [field, setField] = useState('');
    const [operator, setOperator] = useState('');
    const [selectValue, setSelectValue] = useState([]);
    const [numValue, setNumValue] = useState(0);
    const [stringValue, setStringValue] = useState('');
    const [valueType, setValueType] = useState('number');
    const [orderDisable, setOrderDisable] = useState(true);
    const condition = props.condition;
    useEffect(() => {
        if(condition.field) {
            setField(condition.field);
            const operation = condition.operator;
            setOperator(operation);
            const value = condition.value;
            if (operation === 'contains') {
                setSelectValue(value);
                setValueType('select');
            } else if (operation === 'in') {
                setStringValue(value);
                setValueType('string');
            } else {
                setNumValue(value);
                setValueType('number');
            }
        }
    },[]);
    const getFieldValue =  () => {
        return field;
    }
    const getOperatorValue =  () => {
        return operator;
    }
    const getValue =  () => {
        switch(operator) {
            case 'contains':
                return selectValue;
            case 'in':
                return stringValue;
            default:
                return +numValue;
        }
    }
    const fieldSelectRef = useRef(null);
    useImperativeHandle(ref, () => ({
        getFieldValue: () => {
            return field;
        },
        getCondition: () => {
            let condition = {};
            let errorMsgs  = [];
            let fieldValue = getFieldValue();
            if (!fieldValue) {
                errorMsgs.push("Field is not selected");
            } else {
                condition.field = fieldValue;
                let operator = getOperatorValue();
                if (!operator) {
                    errorMsgs.push("Operation is not selected");
                } else {
                    condition.operation = operator;
                    let value = getValue();
                    if (operator === 'contains') {
                        if (value.length === 0) {
                            errorMsgs.push("Items are not selected for value field");
                        } else {
                            condition.value = value;
                        }
                    } else if (operator === 'in') {
                        if (!value) {
                            errorMsgs.push("Value field should not be empty");
                            
                        } else {
                            (value.split(",").length <=1 ) ? errorMsgs.push("Value field should contain multiple comma seperated values") :
                            condition.value = value;
                        }
                    } else {
                        if (value < 0) {
                            errorMsgs.push("Value is not provided");
                        } else {
                            condition.value = value;
                        }
                    }                    
                }
            }
            condition.errorMsgs = errorMsgs;
            return condition;
        },
        getOperatorValue: () => {
            return operator;
        },
        getValue: () => {
            switch(operator) {
                case 'contains':
                    return selectValue;
                case 'in':
                    return stringValue;
                default:
                    return +numValue;
            }
        }
    })); 
    const operationChange = (event) => {
        const operatorValue = event.target.value;
        setOperator(operatorValue);
        switch(operatorValue) {
            case 'contains':
                setValueType('select');
                break;
            case 'in':
                setValueType('string');
                break;
            default:
                setValueType('number');
        }
    }

    const getDisbledValue = (operation) => {
        if (operation.value === 'contains') {
            return orderDisable;
        } else {
            return !orderDisable;
        }
        
    }

    const fieldChange = (event) => {
        const fieldValue = event.target.value;
        setField(fieldValue);
        setOperator('');
        setSelectValue([]);
        setNumValue(0);
        setStringValue('');
        setValueType('number');
        switch(fieldValue) {
            case 'items':
                setOrderDisable(false);
                break;
            default:
                setOrderDisable(true);
        }
    }

    const selectValueChange= (event) => {
        const value = [...event.target.options].filter((option) => { return option.selected}).map((option) => option.value)
        setSelectValue(value);
    }
    const numValueChange= (event) => {
        const value = event.target.value;
        setNumValue(value);
    }
    const stringValueChange= (event) => {
        const value = event.target.value;
        setStringValue(value);
    }
    const removeCondition = () => {
        props.delete(props.index);
    }
    
    return (
        <div className="condition">
            <div className="field">
                {
                    (props.index === 0) ? <label>Field</label>: null
                }
                <select ref={fieldSelectRef} value={field} onChange={(event) => {fieldChange(event)}}>
                    <option value="">Select Field</option>
                    {
                        props.fields.map((field, index) => {
                        return <option key={index} value={field.value}>{field.text}</option>
                        })
                    }
                </select>
            </div>
            <div className="field">
                {
                    (props.index === 0) ? <label>Operation</label>: null
                }
                <select value={operator} onChange={(event) => {operationChange(event)}}> 
                    <option value="">Select Operation</option>
                    {
                    props.operations.map((operation, index) => {
                        return <option key={index} disabled={getDisbledValue(operation)} value={operation.value}>{operation.text}</option>
                    })}
                </select>
            </div>
            <div className="field">
                {
                    (props.index === 0) ? <label>Value</label>: null
                }
                {
                    valueType === 'select' ?
                        (
                            <select value={selectValue} onChange={(event) => {selectValueChange(event)}} multiple>
                                <option value="">Select Item/s</option>
                                {
                                    props.items.map((item, index)=> {
                                        return (<option key={index} value={item.itemValue}>{item.itemName}</option>)
                                    })
                                }
                            </select>
                        ) : 
                        (
                            (valueType === 'string') ? 
                            <input  placeholder="comma seperated values" value={stringValue} onChange={(event) => {stringValueChange(event)}} type="text"/> :
                            <input  onChange={(event) => {numValueChange(event)}} value={numValue} type="number"/>
                        )
                }
            </div>
            {
                (props.index > 0) ? (
                <div title="Remove Condition" onClick= {removeCondition} className="remove">
                    <button class="btn condition">X</button>
                </div>) : null
            }
            
        </div>
    )
}

export default React.forwardRef((props,ref) => Condition(props, ref));
