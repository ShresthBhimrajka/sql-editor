import './App.css';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AceEditor from 'react-ace';
import FeatherIcon from 'feather-icons-react';
import { CSVLink } from 'react-csv';

import 'ace-builds/src-min-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import getData from './mockData/getData';

const App = () => {
	const [value, setValue] = useState('select * from customers;');
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [query, setQuery] = useState('');
    const [defaults, setDefaults] = useState(1);
    const [csvData, setCSVData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchFlag, setSearchFlag] = useState(false);

    const runQuery = value => { // function to retieve the mock data
        toast.success("Query run");
        setSearchData([]);
        setSearchFlag(false);
        setQuery(value);
        const {headers, rows} = getData(defaults);
        setHeaders(headers);
        setRows(rows);
        const temp = []
        if(headers.length > 0 && rows.length > 0) {
            temp.push(headers);
            rows.forEach(row => {
                temp.push(row);
            });
            setCSVData(temp);
        }
    };

    const reset = () => { // function to reset the editor
        setQuery(''); 
        setValue('select * from customers;'); 
        setDefaults(1);
        setHeaders([]);
        setRows([]);
        setCSVData([]);
        setSearchData([]);
        setSearchFlag(false);
        setSearchText('');
    };

    const search = () => { // function to search the query results
        if(searchText.length > 0) {    
            setSearchFlag(true);
            let temp = [];
            for(var i = 0 ; i < rows.length ; i++) {
                for(var j = 0 ; j < rows[i].length ; j++) {
                    if(rows[i][j].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        temp.push(rows[i]);
                        break;
                    }
                }
            }
            setSearchData(temp);
        } else {
            toast.error("Empty Search Text")
        }
    };

    return (
        <div className="App">

            {/* react-hot-toast for notifications*/}
            <Toaster
                position="top-center"
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: "",
                    duration: 5000,
                    style: {
                        background: "#ffffff",
                        color: "#3A4374",
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                        primary: "#293857",
                        secondary: "#ffffff",
                        },
                    },
                    error: {
                        iconTheme: {
                        primary: "#D73737",
                        secondary: "#ffffff",
                        },
                    },
                }}
            />

            {/* body of web page */}
            <div className='main-block'>

                {/* header */}
                <div className='title-header'>
                    <h1 style={{ color:'white', fontSize: 30, fontWeight: 'bold', marginLeft: '5px', width: 'max-content', textAlign: 'center', marginRight: '1%' }}>SQL Editor</h1>
                    <FeatherIcon icon={'database'} size={40} color={'#ffffff'}/>
                </div>

                {/* sql editor block */}
                <div className='editor-block'>
                    <AceEditor
                        id="editor"
                        aria-label="editor"
                        mode="mysql"
                        theme="sqlserver"
                        name="editor"
                        fontSize={16}
                        minLines={15}
                        maxLines={10}
                        width="100%"
                        showPrintMargin={false}
                        showGutter
                        placeholder="Write your Query here..."
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                        }}
                        value={value}
                        onChange={value => setValue(value)}
                        showLineNumbers
                    />
                </div>

                {/* div containing all buttons in one row */}
                <div className='button-block'>

                    {/* div containing run and reset buttons */}
                    <div className='editor-buttons'>
                        <button className='interactive-buttons' onClick={value => runQuery(value)}>
                            <FeatherIcon icon={'play-circle'} size={30} color={'#293857'}/>
                            <p style={{ color:'#293857', fontSize: 14, fontWeight: 'bold', marginLeft: '5px', width: 'max-content' }}>Run Query</p>
                        </button>
                        <button className='interactive-buttons' onClick={reset}>
                            <FeatherIcon icon={'refresh-cw'} size={30} color={'#293857'}/>
                            <p style={{ color:'#293857', fontSize: 14, fontWeight: 'bold', marginLeft: '5px', width: 'max-content' }}>Reset</p>
                        </button>
                    </div>

                    {/* div containing preset query buttons */}
                    <div className='presets'>
                        <p style={{ color:'#293857', fontSize: 16, fontWeight: 'bold', marginLeft: '5px', width: 'max-content' }}>Preset Queries:</p>
                        <button className='interactive-buttons' onClick={() => {setDefaults(1); setValue('select * from customers;')}}>
                            <p style={{ color:'#293857', fontSize: 14, fontWeight: 'bold', width: 'max-content' }}>customers</p>
                        </button>
                        <button className='interactive-buttons' onClick={() => {setDefaults(2); setValue('select * from categories;')}}>
                            <p style={{ color:'#293857', fontSize: 14, fontWeight: 'bold', width: 'max-content' }}>categories</p>
                        </button>
                        <button className='interactive-buttons' onClick={() => {setDefaults(3); setValue('select * from products;')}}>
                            <p style={{ color:'#293857', fontSize: 14, fontWeight: 'bold', width: 'max-content' }}>products</p>
                        </button>
                    </div>

                    {/* div containing export button */}
                    <div className='interactive-buttons'>
                        <CSVLink style={{ display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}} data={csvData} onClick={() => toast.success("Table exported")}>
                            <FeatherIcon icon={'download'} size={30} color={'#293857'}/>
                            <p style={{ color:'#293857', fontSize: 14, fontWeight: 'bold', width: 'max-content' }}>Export Data</p>
                        </CSVLink>
                    </div>
                </div>

                {/* renders the table if a query was given */}
                {query ? 
                <>
                    <div className='results-header'>
                        {/* header of the table */}
                        <h2 style={{ display:'flex' ,color:'#293857', fontSize: 20, fontWeight: 'bold', marginLeft: '5px', width: '40%', textAlign: 'left' }}>Results: {(searchFlag ? searchData.length : rows.length)} rows selected</h2>
                        <div className='search-block'>
                            <text style={{ color:'#293857', fontSize: 20, fontWeight: 'bold', width: 'max-content' }}>Search:</text>
                            <input 
                                type='text' 
                                id='search' 
                                value={searchText} 
                                onChange={event => {
                                    setSearchText(event.target.value);
                                    if(event.target.value === "") {
                                        setSearchFlag(false);
                                    }}}
                            />
                            <button className='search-button' onClick={search}>
                                <FeatherIcon icon={'search'} size={12} color={'#293857'}/>
                            </button>
                        </div>
                    </div>
                    
                    {/* div containing the table */}
                    <div className='result-block'>
                        <div className="table-div">
                            <table className="table">
                                <thead className="thead">
                                    {headers.map(header => (
                                        <th
                                            scope="col"
                                            className="table-row-head"
                                        >
                                            <span className='row-header'>
                                                {header}
                                            </span>
                                        </th>
                                    ))}
                                </thead>
                                <tbody className='tbody'>
                                    {searchFlag ? 
                                    searchData.map((row, i) => {
                                        return (
                                            <tr className='tr'>
                                            {row.map(cell => {
                                                return (
                                                    <td className="td" >
                                                        {cell}
                                                    </td>
                                                )
                                            })}
                                            </tr>
                                        )
                                    }): 
                                    rows.map((row, i) => {
                                        return (
                                            <tr className='tr'>
                                            {row.map(cell => {
                                                return (
                                                    <td className="td" >
                                                        {cell}
                                                    </td>
                                                )
                                            })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>: 
                <>
                    <div className='icon-container'>
                        <FeatherIcon icon={'database'} color={'rgb(216,206,206'} size={200}/>
                        <div className='text-container'>
                            <p style={{ color: 'rgb(216,206,206', fontSize: 30, fontWeight: 'bold', textAlign: 'left'}}>Welcome, to the Online SQL Editor</p>
                            <p style={{ color: 'rgb(216,206,206', fontSize: 30, fontWeight: 'bold', textAlign: 'left'}}>Run a query to see results</p>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    );
}

export default App;
