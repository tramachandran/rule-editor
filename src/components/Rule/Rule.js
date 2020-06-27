import React, { useState, useEffect } from 'react';
import "./Rule.scss";
import { Link, useHistory } from "react-router-dom";
import Condition from '../Condition/Condition';
import defaultItems from '../../models/items';
import defaultOperators from '../../models/operations';
import defaultFields from '../../models/fields';
import axios from 'axios';


const defaultCondition = {
    field: '',
    operation: '',
    value: ''
}

const Rule = (props) => {
    const params = props.match.params;
    let ruleId = params.id || '';
    const [fields, setFields] = useState([]);
    const [operators, setOperators] = useState([]);
    const [items, setItems] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [name, setName] = useState('');
    const [match, setMatch] = useState('any');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsgs, setErrorMsgs] = useState([]);
    useEffect(() => {
        /// need to add the code for setting fields, operations and items from an API call
        setFields(defaultFields);
        setOperators(defaultOperators);
        setItems(defaultItems);
        if (!ruleId) {
            setConditions([defaultCondition]);
        } else {
            getRuleData();
        }
    }, []);
    const getRuleData = () => {
        setIsLoading(true);
        axios.get(`rules/${ruleId}`).then(response => {
            setIsLoading(false);
            const ruleData = response.data;
            setName(ruleData.name);
            setDescription(ruleData.description);
            setMatch(ruleData.match);
            setConditions([...ruleData.conditions]);
            setError('')
        }).catch((err) => {
            setIsLoading(false);
            const errorMsg = err.message;
            setError(errorMsg);
        })
    };

    const closeErrorMsgs = () => {
        setErrorMsgs([]);
    }

    const addRule = () => {
        setConditions([...conditions, defaultCondition]);
    }

    const deleteCondition = (index) => {
        conditions.splice(index, 1);
        setConditions([...conditions]);
    }

    let conditionRefs = [];
    const history = useHistory();
    const saveRule = () => {
        let rule = {};
        let errorMsgs = [];
        rule.name = name;
        if (!name) {
            errorMsgs.push("Rule name should not be empty");
        }
        rule.description = description;
        rule.match = match;
        rule.conditions = [];
        for (let conditionRef of conditionRefs) {
            let condition = conditionRef.current.getCondition();
            // data.field = conditionRef.current.getFieldValue();
            // data.operator = conditionRef.current.getOperatorValue();
            // data.value = conditionRef.current.getValue();
            errorMsgs = [...errorMsgs, ...condition.errorMsgs];
            delete condition.errorMsgs;
            rule.conditions.push(condition);
        }
        rule.id = new Date().getTime();
        if (rule.conditions.length === 0) {
            errorMsgs.push("Add atleast one condition to the rule.")
        }
        if (errorMsgs.length === 0) {
            history.push('/rules');
        } else {
            setErrorMsgs(errorMsgs)
        }

    }
    if (isLoading) {
        return <div><h4>Rule is loading.....</h4></div>
    } else if (error !== '') {
        return <div className="error"><h4>{error}</h4></div>
    } else {
        return (<div className="rule">
            <h3>Rule Details</h3>
            {
                errorMsgs.length > 0 ? (
                    <div className="form-error">
                        <div>Please resolve the following errors to save the rule</div>
                        {
                            errorMsgs.map((msg, index) => {
                                return <div key={index} className="error">{msg}</div>
                            })
                        }
                        <div title="close errors" onClick={closeErrorMsgs} className="remove"><button class="btn btn-link btn-danger">X</button></div>
                    </div>
                ) : null
            }
            <div className="form">
                <div className="field">
                    <label htmlFor="rule-name">Rule Name:</label>
                    <input type="text" placeholder="Rule Name" id="rule-name" value={name} onChange={(event) => { setName(event.target.value) }} />
                </div>
                <div className="field">
                    <label htmlFor="rule-desc">Description:</label>
                    <textarea type="text" id="rule-desc" placeholder="Rule Description" value={description} onChange={(event) => { setDescription(event.target.value) }}></textarea>
                </div>
                <div className="field">
                    <label htmlFor="match">Match:</label>
                    <select type="text" id="match" value={match} onChange={(event) => { setMatch(event.target.value) }}>
                        <option value="any">Any</option>
                        <option value="all">All</option>
                    </select> of the conditions
                </div>
                <div className="heading">Conditions</div>
                <div className="conditions">
                    {
                        conditions.map((condition, index) => {
                            conditionRefs[index] = React.createRef();
                            return (<Condition
                                key={index}
                                condition={condition}
                                delete={deleteCondition}
                                items={items}
                                fields={fields}
                                operations={operators}
                                index={index}
                                ref={conditionRefs[index]}>
                            </Condition>)
                        })
                    }
                </div>
                <div className="add-button">
                    <button className="btn condition" type="button" onClick={() => { addRule() }}>+ Add Condition</button>
                </div>
            </div>
            <div className="footer">
                <button className="btn save" onClick={() => saveRule()}>Save</button>
                <Link to={"/rules"}>
                    <button className="btn close">Close</button>
                </Link>
            </div>
        </div>)
    }
}

export default Rule;
