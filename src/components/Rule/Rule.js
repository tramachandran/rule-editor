import React, { useState, useEffect } from 'react';
import "./Rule.scss";
import {Link, useHistory} from "react-router-dom";
import Condition from '../Condition/Condition';
import defaultItems from '../../models/items';
import defaultOperators from '../../models/operations';
import defaultFields from '../../models/fields';
import axios from 'axios';


const defaultCondition = {
    field: '',
    operation: '',
    value:''
}

const Rule = (props) => {
    const params = props.match.params;
    let ruleId = params.id || '';
    const [fields, setFields] = useState([]);
    const [operators, setOperators] = useState([]);
    const [items, setItems] = useState([]);
    const [conditions, setConditions]=useState([]);
    const [name, setName] = useState('');
    const [match, setMatch] = useState('any');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
    
    const addRule = () => {
        setConditions([...conditions, defaultCondition]);
    }
    
    let conditionRefs = [];
    const history = useHistory();
    const saveRule = () => {
        let rule = {};
        rule.name = name;
        rule.description = description;
        rule.match = match;
        rule.conditions = [];
        for (let conditionRef of conditionRefs) {
            let data = {}
            data.field = conditionRef.current.getFieldValue();
            data.operator = conditionRef.current.getOperatorValue();
            data.value = conditionRef.current.getValue();
            rule.conditions.push(data);
        }
        rule.id = new Date().getTime();
        console.log(rule);
        history.push('/rules');
    }
    if (isLoading) {
        return <div><h4>Rule is loading.....</h4></div>
    } else if (error !== '') {
        return <div className="error"><h4>{error}</h4></div>
    } else {
        return (<div className="rule">
            <h3>Rule Details</h3>
            {
            error ? <div className="error">{error}</div> : null
            }        
            <div className="form">
                <div className="field">
                    <label htmlFor="rule-name">Rule Name:</label>
                    <input type="text" id="rule-name" value={name} onChange={(event) => {setName(event.target.value)}}/>
                </div>
                <div className="field">
                    <label htmlFor="rule-desc">Description:</label>
                    <textarea type="text" id="rule-desc" value={description} onChange={(event) => {setDescription(event.target.value)}}></textarea>
                </div>
                <div className="field">
                    <label htmlFor="match">Match</label>
                    <select type="text" id="match" value={match} onChange={(event) => {setMatch(event.target.value)}}>
                        <option value="any">Any</option>
                        <option value="all">All</option>
                    </select> of the conditions
                </div>
                <h4 style={{textDecoration: 'underline'}}>Conditions</h4>
                <div className="conditions">
                    {
                    conditions.map((condition, index) => {
                        conditionRefs[index] = React.createRef();
                        return (<Condition 
                                    key={index} 
                                    condition={condition}
                                    items={items}
                                    fields={fields} 
                                    operations={operators}
                                    ref={conditionRefs[index]}>
                                </Condition>)
                    })
                    }
                </div>
                <div className="add-button">
                    <button className="btn add-condition" type="button" onClick={() => {addRule()}}>+ Add Condition</button>
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


