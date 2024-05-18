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
      <>
        <h2>{showProfileReport ? "Profile Consumption Report" : "Family Consumption Report"}</h2>
        <p>Profile Name: {report.profileName}</p>
        <p>Profile Age: {report.profileAge}</p>
        <p>Dietary Preference: {report.profileDietary}</p>
        <h3>Consumed Items:</h3>
        {Array.isArray(report.consumedItems) && report.consumedItems.length > 0 ? (
          <ul>
            {report.consumedItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No consumed items found.</p>
        )}
        <h3>Nutrition Summary:</h3>
        <p>Total Calories Remaining: {report.totalCaloriesRemaining}</p>
        <p>Total Protein Remaining: {report.totalProteinRemaining}</p>
        <p>Total Fat Remaining: {report.totalFatRemaining}</p>
        <p>Total Calories Consumed: {report.totalCaloriesConsumed}</p>
        <p>Total Protein Consumed: {report.totalProteinConsumed}</p>
        <p>Total Fat Consumed: {report.totalFatConsumed}</p>
      </>
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