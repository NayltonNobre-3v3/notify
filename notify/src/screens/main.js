import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { AiFillAlert, AiFillFrown } from "react-icons/ai";
import api from "../api/api";
import moment from "moment";
import { toast, Zoom } from "react-toastify";

import "./style.css";

import { useSelector, useDispatch } from "react-redux";
import { listSensor,Delete,listSensorAlert,Save } from "../Actions/SensorListActions";

function Main() {
  const [medicao, setMedicao] = useState([]);
  const [array, setArray] = useState([]);
  const [local, setItems] = useState([]);
  const [ShowEdit, setShowEdit] = useState(false);
  const [IDAlert, setIDAlert] = useState(0);

  const [idSensor, setIdSensor] = useState(0);
  const [nameSensor, setNameSensor] = useState("");
  const [valueSensor, setValueSensor] = useState("");
  const [unitSensor, setUnitSensor] = useState("");
  const [condSensor, setCondSensor] = useState("");
  const [TimeSensor, setTimeSensor] = useState(0);
  const [DestSensor, setDestSensor] = useState("");

  // Pego a o meu estado
  const SensorList = useSelector((state) => state.sensorList);
  // Listando todos os sensores que estão no banco
  const { sensors, loading, error } = SensorList;
  // Pego a o meu estado
  const SensorListOne = useSelector((state) => state.sensorDetail);
  const { sensor, loading: loadingSensor, error: ErrorSensor } = SensorListOne;

  // SENSOR DELETE
  const sensorDel = useSelector((state) => state.SensorDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    sucess: sucessDelete,
  } = sensorDel;

  // SENSOR ALERT
  const sensorAlert = useSelector((state) => state.SensorAlertList);
  const {
    loading: loadingAlert,
    error: errorAlert,
    sucess: sucessAlert,
  } = sensorAlert;

  const sensorSave = useSelector((state) => state.SensorSave);
  const {
    loading: loadingSave,
    error: errorSave,
    sucess: sucessSave,
  } = sensorSave;

  if(ErrorSensor){
    toast.error("Error ao carregar os sensores", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  

  // Disparador de actions
  const dispatch = useDispatch();

  // Carrega todo o valores quando eu reiniciar o estado
  useEffect(() => {
    dispatch(listSensor());
  }, []);

  // Sempre que eu alterar o array irá alterar
  useEffect(() => {
    dispatch(listSensorAlert())
  }, [array,sucessSave]);

  // Sempre que eu deletar um sensor e a operação for realizada com sucesso então
  // irá recarregar os dados
  useEffect(() => {
      async function getValues() {
        const { data } = await api.get("sensors-alert");
        setItems(data.data);
      }
      getValues();
    }, [sucessDelete]);

  // Extrai as medições do sensor específico
  async function ListOneSensor(e) {
    const data = await api.get(`get-sensor-monitoring/${e.target.value}`);
    const json = JSON.stringify(data.data);
    const medicao = JSON.parse(json);
    // const values = Object.values(medicao).map((item) => item.MEASURES);
    const values = medicao.map((item) => item.TYPE);
    setMedicao(values);
    setIdSensor(data.data[0].ID);
    setNameSensor(data.data[0].NAME);
    // console.log('MEDIÇÃO= ',values)
  }

  async function ListOneSensorEdit(e) {
    const data = await api.get(`get-sensor-monitoring/${e}`);
    const json = JSON.stringify(data.data);
    const medicao = JSON.parse(json);
    const values = medicao.map((item) => item.TYPE);
    setMedicao(values);
    setIdSensor(data.data[0].ID);
    setNameSensor(data.data[0].NAME);
  }
  async function submitHandle(e) {
    e.preventDefault();

    let obj = {
      ID_SENSOR: idSensor,
      VALUE: Number(unitSensor),
      NAME: nameSensor,
      POSITION: Number(valueSensor),
      COND: condSensor,
      TIME: Number(TimeSensor),
      EMAIL: DestSensor,
    };
    dispatch(Save(obj))
    // console.log("OBJ= ", obj);
  }
  async function submitHandlePUT(e) {
    e.preventDefault();

    let obj = {
      ID_SENSOR: idSensor,
      VALUE: Number(unitSensor),
      NAME: nameSensor,
      POSITION: Number(valueSensor),
      COND: condSensor,
      TIME: Number(TimeSensor),
      EMAIL: DestSensor,
    };
    // console.log("OBJ= ", obj);
    try {
      const data = await api.put(`/put-sensor-alert/${IDAlert}`, obj);
      // console.log("ERROR= ", data);

      if (array.length === 0) {
        setArray([data.data]);
      } else {
        setArray([...array, data.data]);
      }
      toast.success(`Alarme atualizado com sucesso!`, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Opa colega, deu error aí", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja deletar o alarme?")) {
      dispatch(Delete(id));
    }
    // setItems(local);
  }

  function ShowEditForm(data) {
    // console.log(data)
    ListOneSensorEdit(data.ID_SENSOR);
    // setIdSensor(data.ID_SENSOR)
    // setNameSensor(data.NAME)
    setValueSensor(data.VALUE);
    setCondSensor(data.COND);
    setTimeSensor(data.TIME);
    setIDAlert(data.ID);
    setDestSensor(data.EMAIL);
    setShowEdit(true);
  }
  function hideEditForm() {
    setMedicao([]);
    setIdSensor(0);
    setNameSensor("");
    setValueSensor("");
    setUnitSensor("");
    setCondSensor("0");
    setTimeSensor(0);
    setDestSensor("");
    setItems(0);
    setShowEdit(false);
  }

  return (
    <div className="container">
      <main>
        <div className="monitSelect">
          {ShowEdit ? (
            <form onSubmit={submitHandlePUT}>
              <fieldset>
                <h1 id="titleForm">Editar Alarme</h1>
                <br />
                <div className="input-group">
                  <label htmlFor="selectModel">Nome do sensor:</label>
                  <select
                    id="selectModel"
                    onChange={ListOneSensor}
                    required
                    title="Nome do sensor"
                    value={nameSensor}
                  >
                    <option value={idSensor}>{nameSensor}</option>

                    {sensors.map((e, i) => (
                      <option value={e.ID} key={i}>
                        {e.NAME}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="selectMeasures">Medição:</label>
                  <select
                    id="selectMeasures"
                    onChange={(e) => setValueSensor(e.target.value)}
                    title="Medida do sensor"
                    required
                    // value={}
                  >
                    {medicao.map((item) =>
                      item.map((e, i) => (
                        <option value={`${i}`} key={i} data={e.UNIT}>
                          {e}
                          {/* {"SELECIONANDO= ",console.log(e)} */}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="selectUnit">Valor:</label>
                  <input
                    type="text"
                    id="ValueInput"
                    value={valueSensor}
                    onChange={(e) => setUnitSensor(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="condition">Condição:</label>
                  <select
                    onChange={(e) => {
                      setCondSensor(e.target.value);
                    }}
                    title="Condição para alarmar"
                    value={condSensor}
                    required
                  >
                    <option value="ACIMA">Acima</option>
                    <option value="ABAIXO">Abaixo</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="selectTime" title="Tempo em minutos">
                    Tempo (minutos):
                  </label>
                  <input
                    id="selectTime"
                    type="number"
                    value={TimeSensor}
                    placeholder="Selecione o tempo"
                    min={0}
                    max={59}
                    onChange={(e) => setTimeSensor(e.target.value)}
                    required
                  ></input>
                </div>

                <div className="input-group">
                  <label htmlFor="selectDest" title="Destinatário">
                    Destinatário:
                  </label>
                  <input
                    id="selectDest"
                    type="email"
                    value={DestSensor}
                    placeholder="Selecione o destinatário"
                    onChange={(e) => setDestSensor(e.target.value)}
                    required
                  ></input>
                </div>
                <div className="buttons-container">
                  <button type="submit">Atualizar alerta</button>
                  <button type="button" onClick={(_) => hideEditForm()}>
                    Voltar
                  </button>
                </div>
              </fieldset>
            </form>
          ) : (
            <form onSubmit={submitHandle}>
              <fieldset>
                <h1 id="titleForm">Criar Alarme</h1>
                <br />
                <div className="input-group">
                  <label htmlFor="selectModel">Nome do sensor:</label>
                  <select
                    id="selectModel"
                    onChange={ListOneSensor}
                    value={nameSensor ? idSensor : "1"}

                    required
                    title="Nome do sensor"
                  >
                    <option value="1" disabled>
                      Selecione
                    </option>
                    {sensors.map((e, i) => (
                      <option value={e.ID} key={i}>
                        {e.NAME}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="selectMeasures">Medição:</label>
                  <select
                    id="selectMeasures"
                    disabled={medicao.length === 0 ? true : false}
                    onChange={(e) => setValueSensor(e.target.value)}
                    title="Medida do sensor"
                    // defaultValue={nameSensor?"1":condSensor}
                    required
                  >
                    <option value="1" disabled>
                      {/* {console.log(nameSensor ===0?'EXISTE':'VAZIO' )} */}
                      Selecione
                    </option>
                    {medicao.map((item) =>
                      item.map((e, i) => (
                        <option value={`${i}`} key={i}>
                          {e}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="selectUnit">Valor:</label>
                  <input
                    type="text"
                    id="ValueInput"
                    onChange={(e) => setUnitSensor(e.target.value)}
                    value={unitSensor}
                    disabled={medicao.length === 0 ? true : false}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="condition">Condição:</label>
                  <select
                    disabled={medicao.length === 0 ? true : false}
                    onChange={(e) => {
                      setCondSensor(e.target.value);
                    }}
                    title="Condição para alarmar"
                    defaultValue={!condSensor ? "0" : condSensor}
                    required
                  >
                    <option value="0" disabled>
                      Selecione
                    </option>
                    <option value="ACIMA">Acima</option>
                    <option value="ABAIXO">Abaixo</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="selectTime" title="Tempo em minutos">
                    Tempo (minutos):
                  </label>
                  <input
                    id="selectTime"
                    type="number"
                    value={TimeSensor}
                    placeholder="Selecione o tempo"
                    min={0}
                    max={59}
                    disabled={medicao.length === 0 ? true : false}
                    onChange={(e) => setTimeSensor(e.target.value)}
                    required
                  ></input>
                </div>

                <div className="input-group">
                  <label htmlFor="selectDest" title="Destinatário">
                    Destinatário:
                  </label>
                  <input
                    id="selectDest"
                    type="email"
                    value={DestSensor}
                    placeholder="Selecione o destinatário"
                    disabled={medicao.length === 0 ? true : false}
                    onChange={(e) => setDestSensor(e.target.value)}
                    required
                  ></input>
                </div>
                <div className="buttons-container">
                  <button
                    type="submit"
                    disabled={medicao.length === 0 ? true : false}
                  >
                    Criar Alerta
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </div>

        <div className="mySchedule">
          {/* <div>
            <AiFillAlert color="#ffcc66" size={50} /> <p>Alertas</p>
          </div> */}
          <ul className="list-cards">
            {/* */}
            {local && local.length !== 0 ? (
              local.map((e, i) => (
                <li className="card" key={e.ID}>
                  {/* {console.log('LOCAL= ',e)} */}
                  <div className="head-card">
                    <h1>{e.NAME}</h1>
                  </div>
                  <div className="content-card">
                    <p>
                      Condição: {e.COND} de {e.VALUE} {e.MEDITION}
                    </p>
                    <p>Tempo para enviar alerta: {e.TIME / 60} min</p>
                  </div>
                  <div id="footer-Container">
                    <p className="date-detail">
                      Alerta criado em {e.created_at}
                    </p>

                    <div id="buttons-Container">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => ShowEditForm(e)}
                      >
                        <FaPen color="white" />
                      </button>
                      <button
                        className="delete-button"
                        onClick={(_) => handleDelete(e.ID)}
                      >
                        <FaTrash color="white" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div id="not-found">
                {" "}
                <AiFillFrown size={60} /> Nenhum alerta registrado
              </div>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Main;
