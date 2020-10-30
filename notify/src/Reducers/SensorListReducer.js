// Constantes usadas para evitar erros de digitações
import {
  SENSOR_LIST_FAIL,
  SENSOR_LIST_REQUEST,
  SENSOR_LIST_SUCESS,
} from "../Constants/SensorContants";

// Reducar irá possuir um estado inicial e recebe action
function SensorListReducer(state = { sensors: [] }, action) {
  switch (action.type) {
    case SENSOR_LIST_REQUEST:
      return { loading: true, sensors: [] };
    case SENSOR_LIST_SUCESS:
      return { loading: false, sensors: action.payload };
    case SENSOR_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

// function SensorSaveReducer(state = {  sensor: {} }, action) {
//   switch (action.type) {
//     case SENSOR_SAVE_REQUEST:
//       return { loading: true,  sensor: {} };
//     case SENSOR_SAVE_SUCCESS:
//       return { loading: false,sucess: true, sensor: action.payload };
//     case SENSOR_SAVE_ERROR:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// }
// function SensorAlertListReducer(state = { alerts: [] }, action) {
//   switch (action.type) {
//     case SENSOR_ALERT_REQUEST:
//       return { loading: true, alerts: [] };
//     case  SENSOR_ALERT_SUCCESS:
//       return { loading: false, sucess: true ,alerts: action.payload };
//     case SENSOR_ALERT_ERROR:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// }
// function SensorDetailReducer(state = { sensor: {} }, action) {
//   switch (action.type) {
//     case SENSOR_DETAILS_REQUEST:
//       return { loading: true };
//     case SENSOR_DETAILS_SUCESS:
//       return { loading: false, sensor: action.payload };
//     case SENSOR_DETAILS_FAIL:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// }
// function SensorDeleteReducer(state = { sensor: {} }, action) {
//   switch (action.type) {
//     case SENSOR_DELETE_REQUEST:
//       return { loading: true };
//     case SENSOR_DELETE_SUCESS:
//       return { loading: false, sucess: true, sensor: action.payload };
//     case SENSOR_DELETE_FAIL:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// }
export { SensorListReducer};
