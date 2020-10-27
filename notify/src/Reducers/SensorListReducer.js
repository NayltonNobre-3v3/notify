// Constantes usadas para evitar erros de digitações
import {
    SENSOR_LIST_FAIL,
    SENSOR_LIST_REQUEST,
    SENSOR_LIST_SUCESS,
    SENSOR_DETAILS_FAIL,
    SENSOR_DETAILS_REQUEST,
    SENSOR_DETAILS_SUCESS
  } from "../Constants/SensorContants";
  
  // Reducar irá possuir um estado inicial e recebe action
  function SensorListReducer(state = { sensors: [] }, action) {
    switch (action.type) {
      case SENSOR_LIST_REQUEST:
        return { loading: true,sensors:[] };
      case SENSOR_LIST_SUCESS:
        return { loading: false, sensors: action.payload };
      case SENSOR_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  }
  function SensorDetailReducer(state = { sensor: {}}, action) {
    switch (action.type) {
      case SENSOR_DETAILS_REQUEST:
        return { loading: true };
      case SENSOR_DETAILS_SUCESS:
        return { loading: false, sensor: action.payload };
      case SENSOR_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  }
//   function SensorDeleteReducer(state = { product: {}}, action) {
//     switch (action.type) {
//       case PRODUCT_DELETE_REQUEST:
//         return { loading: true };
//       case PRODUCT_DELETE_SUCESS:
//         return { loading: false, sucess:true,product: action.payload };
//       case PRODUCT_DELETE_FAIL:
//         return { loading: false, error: action.payload };
//       default:
//         return state;
//     }
//   }
export { SensorListReducer,SensorDetailReducer};