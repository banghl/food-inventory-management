import React, { useState, useEffect } from "react";

function NutritionTarget() {
  const [nutritionTargets, setNutritionTargets] = useState({
    calo: 0,
    protein: 0,
    fat: 0,
  });
  const [consumedNutrients, setConsumedNutrients] = useState({
    calo: 0,
    protein: 0,
    fat: 0,
  });

  const profileId = localStorage.getItem("profileId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
   const savedTargets = localStorage.getItem('nutritionTargets');
   if (savedTargets) {
     setNutritionTargets(JSON.parse(savedTargets));
   }
   fetchNutritionTargets();
   fetchConsumptionData();
 }, []);
 

  const fetchNutritionTargets = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/nutrition-targets/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.flag && data.code === 200) {
        setNutritionTargets(data.data);
      }
    } catch (error) {
      console.error("Error fetching nutrition targets:", error);
    }
  };

  const fetchConsumptionData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/consumption-records?profile=${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.flag && data.code === 200) {
        const totals = data.data.reduce(
          (acc, quantity) => {
            acc.calo += quantity.item.calories;
            acc.protein += quantity.item.protein;
            acc.fat += quantity.item.fat;
            return acc;
          },
          { calo: 0, protein: 0, fat: 0 }
        );
        setConsumedNutrients(totals);
      }
    } catch (error) {
      console.error("Error fetching consumed items:", error);
    }
  };

  const handleTargetChange = (e) => {
    setNutritionTargets({
      ...nutritionTargets,
      [e.target.name]: e.target.value,
    });
  };

  const setTargets = async () => {
   try {
     const response = await fetch(
       `http://localhost:8080/api/v1/nutrition-targets/set/${profileId}?calo=${nutritionTargets.calo}&protein=${nutritionTargets.protein}&fat=${nutritionTargets.fat}`,
       {
         method: "POST",
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
       }
     );
     const data = await response.json();
     if (data.flag && data.code === 200) {
       alert("Nutrition targets set successfully!");
       // Save the targets to local storage for persistence
       localStorage.setItem('nutritionTargets', JSON.stringify(nutritionTargets));
     }
   } catch (error) {
     console.error("Error setting nutrition targets:", error);
   }
 };
 
  const calculateProgress = (consumed, target) => {
    return target > 0 ? (consumed / target) * 100 : 0;
  };

  return (
    <div
      className="bg-dark min-vh-100 d-flex justify-content-center align-items-start"
      style={{ marginLeft: "300px", marginTop: "200px" }}
    >
      <div className="bg-white p-4 rounded text-black">
        <div className="container my-5">
          <h1 className="text-center mb-4">Set Nutrition Targets</h1>
          <div className="row justify-content-center mb-3">
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                name="calo"
                placeholder="Calories target"
                value={nutritionTargets.calo}
                onChange={handleTargetChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                name="protein"
                placeholder="Protein target"
                value={nutritionTargets.protein}
                onChange={handleTargetChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                name="fat"
                placeholder="Fat target"
                value={nutritionTargets.fat}
                onChange={handleTargetChange}
              />
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={setTargets}>
              Set Targets
            </button>
          </div>

          <h2 className="text-center my-4">Nutrition Progress</h2>
          <div className="mb-3">
            <label>
              Calories: {consumedNutrients.calo} / {nutritionTargets.calo}
            </label>
            <div className="progress">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{
                  width: `${calculateProgress(
                    consumedNutrients.calo,
                    nutritionTargets.calo
                  )}%`,
                }}
                aria-valuenow={calculateProgress(
                  consumedNutrients.calo,
                  nutritionTargets.calo
                )}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {calculateProgress(
                  consumedNutrients.calo,
                  nutritionTargets.calo
                ).toFixed(2)}
                %
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label>
              Protein: {consumedNutrients.protein} / {nutritionTargets.protein}
            </label>
            <div className="progress">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{
                  width: `${calculateProgress(
                    consumedNutrients.protein,
                    nutritionTargets.protein
                  )}%`,
                }}
                aria-valuenow={calculateProgress(
                  consumedNutrients.protein,
                  nutritionTargets.protein
                )}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {calculateProgress(
                  consumedNutrients.protein,
                  nutritionTargets.protein
                ).toFixed(2)}
                %
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label>
              Fat: {consumedNutrients.fat} / {nutritionTargets.fat}
            </label>
            <div className="progress">
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{
                  width: `${calculateProgress(
                    consumedNutrients.fat,
                    nutritionTargets.fat
                  )}%`,
                }}
                aria-valuenow={calculateProgress(
                  consumedNutrients.fat,
                  nutritionTargets.fat
                )}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {calculateProgress(
                  consumedNutrients.fat,
                  nutritionTargets.fat
                ).toFixed(2)}
                %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionTarget;
