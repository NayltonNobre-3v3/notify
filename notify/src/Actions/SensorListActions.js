import api from "../api/api";
import {
  SENSOR_LIST_SUCESS,
  SENSOR_LIST_FAIL,
  SENSOR_LIST_REQUEST,
  SENSOR_DETAILS_FAIL,
  SENSOR_DETAILS_REQUEST,
  SENSOR_DETAILS_SUCESS,
  SENSOR_DELETE_FAIL,
  SENSOR_DELETE_REQUEST,
  SENSOR_DELETE_SUCESS,
  SENSOR_ALERT_REQUEST,
  SENSOR_ALERT_SUCCESS,
  SENSOR_ALERT_ERROR,
  SENSOR_SAVE_ERROR,
  SENSOR_SAVE_REQUEST,
  SENSOR_SAVE_SUCCESS
} from "../Constants/SensorContants";

const listSensor = () => async (dispatch) => {
  try {
    // Disparo a action PRODUCT_LIST_REQUEST que irá realizar o loading
    dispatch({ type: SENSOR_LIST_REQUEST });
    // console.log("LISTPRODUCTS= ",category,searchKeyword,sortOrder)
    const { data } = await api.get("get-sensor-monitoring");
    // Disparo a action que irá carregar as listas
    dispatch({ type: SENSOR_LIST_SUCESS, payload: data });
  } catch (error) {
    dispatch({ type: SENSOR_LIST_FAIL, payload: error.message });
  }
};

const listSensorAlert = () => async (dispatch) => {
  try {
    // Disparo a action PRODUCT_LIST_REQUEST que irá realizar o loading
    dispatch({ type: SENSOR_ALERT_REQUEST });
    // console.log("LISTPRODUCTS= ",category,searchKeyword,sortOrder)
    const { data } = await api.get("sensors-alert");
    // Disparo a action que irá carregar as listas
    dispatch({ type: SENSOR_ALERT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SENSOR_ALERT_ERROR, payload: error.message });
  }
};

const listOneSensor = (id) => async (dispatch) => {
  try {
    // Disparo a action PRODUCT_LIST_REQUEST que irá realizar o loading
    dispatch({ type: SENSOR_DETAILS_REQUEST });
    const { data } = await api.get(`get-sensor-monitoring/${id}`);
    console.log('LIST ONE SENSOR= ',data[0])
    // Disparo a action que irá carregar as listas
    dispatch({ type: SENSOR_DETAILS_SUCESS, payload: data[0] });
  } catch (error) {
    dispatch({ type: SENSOR_DETAILS_FAIL, payload: error.message });
  }
};

// const productsDetails = (ProductID) => async (dispatch) => {
//   try {
//     dispatch({ type: SENSOR_DETAILS_REQUEST, payload: ProductID });
//     const sensor = await api.get(`get-sensor-monitoring/${SensorID}`);
//     dispatch({ type: SENSOR_DETAILS_SUCESS, payload: sensor.data });
//   } catch (error) {
//     dispatch({ type: SENSOR_DETAILS_FAIL, payload: error.message });
//   }
// };

const Delete = (id) => async (dispatch) => {
  try {
    dispatch({ type: SENSOR_DELETE_REQUEST});
    const {data} = await api.delete(`/delete-sensor-alert/${id}`);
    // console.log("DATA DELETE",product)
    dispatch({ type: SENSOR_DELETE_SUCESS, payload: data,sucess:true});
  } catch (error) {
    dispatch({ type: SENSOR_DELETE_FAIL, payload: error.message});
  }
};

const Save = (obj) => async (dispatch) => {
  try {
    dispatch({ type: SENSOR_SAVE_REQUEST});
    const data = await api.post("post-sensor-alert", obj);
    // console.log("DATA DELETE",product)
    dispatch({ type: SENSOR_SAVE_SUCCESS, payload: data,sucess:true});
  } catch (error) {
    dispatch({ type: SENSOR_SAVE_ERROR, payload: error.message});
  }
};


export { listSensor,listOneSensor,Delete,listSensorAlert,Save};