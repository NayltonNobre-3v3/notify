import api from "../api/api";
import {
  SENSOR_LIST_SUCESS,
  SENSOR_LIST_FAIL,
  SENSOR_LIST_REQUEST,
  SENSOR_DETAILS_FAIL,
  SENSOR_DETAILS_REQUEST,
  SENSOR_DETAILS_SUCESS
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


export { listSensor,listOneSensor};