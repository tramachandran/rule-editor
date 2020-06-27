import React, { useState, useEffect } from 'react';
import "./Rules-list.scss";
import axios from 'axios';
import {Link} from "react-router-dom";

axios.defaults.baseURL = 'https://my-json-server.typicode.com/tramachandran/customer-list/';

function RulesList(stateProps) {
    
    const [ruleState, setRuleState] = useState({
        isLoading: false,
        rules: [],
        errorMsg: ''
    });  
    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = () => {
        setRuleState({
            ...ruleState,
            isLoading: true
        });
        axios.get(`rules`)
          .then(response => {
              const rules = response.data;
              setRuleState({
                errorMsg: '',
                isLoading: false,
                rules: rules
              });
          }).catch((err) => {
            const errorMsg = err.message;
            setRuleState({
                errorMsg: errorMsg,
                isLoading: false,
                rules: []
            })
          })
    }
    const getShortDate = (timeInSecs) => {
        if (timeInSecs) {
            let date = new Date(timeInSecs);
            return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        } else {
            return '--';
        }
        
    }
    const rules = ruleState.rules;

    if (ruleState.isLoading) {
        return <div><h4>Hold on rules are loading.....</h4></div>
    } else if (ruleState.errorMsg !== '') {
        return <div className="error"><h4>{ruleState.errorMsg}</h4></div>
    } else {
        const content = rules.length > 0 ? rules.map((rule, index) => {
            return (<div key={index} className="card">
                        <Link to={`./rules/${rule.id}`}>
                            <div className="header">{rule.name}</div>
                        </Link>
                        <div className="body">
                            <div className="data-list">
                                <span>No.of Conditions: </span>
                                <span className="badge">{rule.conditions.length}</span>
                            </div>
                            <div className="data-list">
                                <span>Created on: </span>
                                <span>{getShortDate(rule.id)}</span>
                            </div>
                            <div className="data-list">
                                <span>Created By: </span>
                                <span>{rule.createdby}</span>
                            </div>
                            <div className="data-list">
                                <span>Updated on: </span>
                                <span>{getShortDate(rule.updatedon)}</span>
                            </div>
                            <div className="description">{rule.description || 'No description provided for this rule.'}</div>
                        </div>
                        <div className="footer">
                            <Link to={`./rules/${rule.id}`}>
                                <button className="btn btn-link">Edit</button>
                            </Link>
                            <button className="btn btn-link btn-danger">Delete</button>
                        </div>
                    </div>
                    )
        }) : <span>No rules available</span>;
        return (
            <div className="rules-list">
                <div className="title">Rules List</div>
                <Link to={'/rules/new'}>
                    <button className="btn" type="button">+ Add Rule</button>
                </Link>
                <div className="cards">
                    {
                        content 
                    }
                </div>
            </div>
        )
    }
}

export default RulesList;
