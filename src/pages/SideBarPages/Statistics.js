import React, { useState, useEffect } from "react";

function Statistics() {
  const [profileReport, setProfileReport] = useState(null);
  const [userReport, setUserReport] = useState(null);
  const [showProfileReport, setShowProfileReport] = useState(true);
  const profileId = localStorage.getItem("profileId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // Fetch profile report
    fetch(`http://localhost:8080/api/v1/reports/${profileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.flag && data.code === 200) {
          setProfileReport(data.data);
        }
      })
      .catch((error) => console.error("Error fetching profile report:", error));

    // Fetch user report
    fetch(`http://localhost:8080/api/v1/reports/all/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.flag && data.code === 200) {
          setUserReport(data.data);
        }
      })
      .catch((error) => console.error("Error fetching user report:", error));
  }, []);

  const renderReportDetails = (report) => {
    return (
      <div className="card mb-3">
        <div className="card-header">
          <h2>{showProfileReport ? "Profile Consumption Report" : "Family Consumption Report"}</h2>
        </div>
        <div className="card-body">
          <h5 className="card-title">Profile Details</h5>
          <p className="card-text">Profile Name: {report.profileName}</p>
          <p className="card-text">Profile Age: {report.profileAge}</p>
          <p className="card-text">Dietary Preference: {report.profileDietary}</p>
          <h5 className="card-title">Items Added</h5>
          {Array.isArray(report.consumedItems) && report.consumedItems.length > 0 ? (
            <ul className="list-group list-group-flush">
              {report.consumedItems.map((item, index) => (
                <li className="list-group-item" key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="card-text">No items added found.</p>
          )}
          <h5 className="card-title">Nutrition Summary</h5>
          <table className="table">
            <tbody>
              <tr>
                <th scope="row">Total Calories Remaining</th>
                <td>{report.totalCaloriesRemaining}</td>
              </tr>
              <tr>
                <th scope="row">Total Protein Remaining</th>
                <td>{report.totalProteinRemaining}</td>
              </tr>
              <tr>
                <th scope="row">Total Fat Remaining</th>
                <td>{report.totalFatRemaining}</td>
              </tr>
              <tr>
                <th scope="row">Total Calories Consumed</th>
                <td>{report.totalCaloriesConsumed}</td>
              </tr>
              <tr>
                <th scope="row">Total Protein Consumed</th>
                <td>{report.totalProteinConsumed}</td>
              </tr>
              <tr>
                <th scope="row">Total Fat Consumed</th>
                <td>{report.totalFatConsumed}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const toggleReport = () => {
    setShowProfileReport(!showProfileReport);
  };

  return (
    <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-start" style={{ marginLeft: "300px", width: "1000px" }}>
      <div className="bg-white p-4 rounded text-black" style={{ marginTop: "100px", width: "100%", height: "700px", overflowY: "scroll" }}>
        <div className="container my-4">
          <h1>Statistics</h1>
          <button className="btn btn-primary my-2" onClick={toggleReport}>
            {showProfileReport ? "Show Family Report" : "Show Profile Report"}
          </button>
          {showProfileReport && profileReport ? renderReportDetails(profileReport) : null}
          {!showProfileReport && userReport ? (
            <>
              {userReport.map((report, index) => (
                <div key={index}>
                  {renderReportDetails(report)}
                  <hr />
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Statistics;