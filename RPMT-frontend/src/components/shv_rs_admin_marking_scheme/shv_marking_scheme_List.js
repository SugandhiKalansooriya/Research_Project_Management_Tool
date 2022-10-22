import React, { useState, useEffect } from 'react';
import download from 'downloadjs';
import axios from 'axios';
const API_URL = 'https://af-test-deploy-app.herokuapp.com';

const MarkingSchemeList = () => {
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const getFilesList = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/MschemegetAllFiles`);
        setErrorMsg('');
        setFilesList(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };

    getFilesList();
  }, []);

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`${API_URL}/Mschemedownload/${id}`, {
        responseType: 'blob'
      });
      const split = path.split('/');
      const filename = split[split.length - 1];
      setErrorMsg('');
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading Marking Scheme. Try again later');
      }
    }
  };

      //search..........................
      const filteredItems = filesList.filter((sup) =>
      sup.markingscheme.toLocaleLowerCase().includes(filterText),
      
    );
    const filesLists = filterText ? filteredItems : filesList;

  return (
    <div>
    <h1 className="h3 mb-3 font-weight-normal" ><font face = "Comic sans MS" size =""><b>Uploaded Marking Schemes</b></font></h1><br/>
    <div className="container">

    <form action="">
                  <input
                    className="float-right"
                    type="text"
                    placeholder="Search"
                    name="search"
                    onChange={(e) =>
                      setFilterText(e.target.value.toLocaleLowerCase())
                    }/>
                    </form><br/>{" "}
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <br/>
      <table className="files-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Uploaded Date</th>
            <th>Download Marking Scheme</th>
          </tr>
        </thead>
        <tbody>
          {filesList.length > 0 ? (
            filesLists.map(
              ({ _id, markingscheme, createdAt, file_path, file_mimetype }) => (
                <tr key={_id}>
                  <td className="file-title">{markingscheme}</td>
                  <td className="file-title">{createdAt}</td>
                  <td>
                    <a
                      href="#/"
                      onClick={() =>
                        downloadFile(_id, file_path, file_mimetype)
                      }
                    >
                      Click here to download
                    </a>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={3} style={{ fontWeight: '300' }}>
                No Marking Schemes found. Please add some.
              </td>
            </tr>
          )}
        </tbody>
      </table><br/>
      <a href='/dashboard'>
      <button type="button" class="btn btn-danger">Back</button>
    </a>
    </div>
    </div>
  );
};

export default MarkingSchemeList;