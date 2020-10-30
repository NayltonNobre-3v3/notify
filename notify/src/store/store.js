import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  SensorListReducer,
} from "../Reducers/SensorListReducer";
const initialState = {};

const reducer = combineReducers({
  sensorList: SensorListReducer,
  // sensorDetail:SensorDetailReducer,
  // SensorDelete: SensorDeleteReducer,
  // SensorAlertList:SensorAlertListReducer,
  // SensorSave: SensorSaveReducer
});
const composeEnnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnnhancer(applyMiddleware(thunk))
);

export default store