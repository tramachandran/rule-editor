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

    const rules = ruleState.rules;

    if (ruleState.isLoading) {
        return <div><h4>Hold on data is loading.....</h4></div>
    } else if (ruleState.errorMsg !== '') {
        return <div className="error"><h4>{ruleState.errorMsg}</h4></div>
    } else {
        const content = rules.length > 0 ? rules.map((rule, index) => {
            return <Link key={index} to={`./rules/${rule.id}`}>
                        <div className="card">
                            <div className="header">{rule.name}</div>
                        </div>
                    </Link>
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
