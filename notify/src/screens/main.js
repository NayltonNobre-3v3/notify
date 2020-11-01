import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { AiFillAlert, AiFillFrown } from "react-icons/ai";
import api from "../api/api";
import axios from 'axios'
import moment from "moment";
import { toast, Zoom } from "react-toastify";


import "./style.css";

import { useSelector, useDispatch } from "react-redux";
import { listSensor } from "../Actions/SensorListActions";

function Main() {
  const [medicao, setMedicao] = useState([]);
  const [local, setItems] = useState([]);
  const [ShowEdit, setShowEdit] = useState(false);
  const [IDAlert, setIDAlert] = useState(0);

  const [idSensor, setIdSensor] = useState(0);
  const [nameSensor, setNameSensor] = useState("");
  const [valueSensor, setValueSensor] = useState(0);
  const [PositionSensor, setPositionSensor] = useState(0);
  const [unitSensor, setUnitSensor] = useState("");
  const [condSensor, setCondSensor] = useState("");
  const [TimeSensor, setTimeSensor] = useState(0);
  const [DestSensor, setDestSensor] = useState("");
  const [NameUnit, setNameUnit] = useState("");


  // Pego a o meu estado
  const SensorList = useSelector((state) => state.sensorList);
  // Listando todos os sensores que estão no banco
  const { sensors, loading, error } = SensorList;

  // Disparador de actions
  const dispatch = useDispatch();

  // Carrega todo o valores quando eu reiniciar o estado
  useEffect(() => {
    dispatch(listSensor());
  }, []);

  // Quando iniciar a aplicação irá carregar todos os valores do banco
  useEffect(() => {
    async function getValues() {
      const { data } = await api.get("notify-sensors-alert");
      setItems(data.data);
    }
    getValues();
  }, []);

  // Extrai as medições do sensor específico
  async function ListOneSensor(e) {
    const data = await api.get(`notify-get-sensors/${e.target.value}`);
    const json = JSON.stringify(data.data);
    const medicao = JSON.parse(json);

    const values = medicao.map((item) => item.TYPE);
    setMedicao(values);
    setIdSensor(data.data[0].ID);
    setNameSensor(data.data[0].NAME);
    setNameUnit(data.data[0].UNIT)
    console.log('NAME UNIT ', NameUnit)

  }

  async function ListOneSensorEdit(e) {
    const data = await api.get(`notify-get-sensors/${e}`);
    const json = JSON.stringify(data.data);
    const medicao = JSON.parse(json);
    const values = medicao.map((item) => item.TYPE);
    setMedicao(values);
    setIdSensor(data.data[0].ID);
    setNameSensor(data.data[0].NAME);
    setNameUnit(data.data[0].UNIT)
    console.log('NAME UNIT ', NameUnit)
  }

  // POST
  function submitHandle(e) {
    e.preventDefault();

    let obj = {
      ID_SENSOR: idSensor,
      VALUE: Number(valueSensor),
      NAME: nameSensor,
      POSITION: Number(PositionSensor),
      UNIT: unitSensor,
      COND: condSensor,
      TIME: Number(TimeSensor),
      EMAIL: DestSensor,
    };
    // console.log('SUBMIT= ',obj)
    api.post("notify-post-sensor-alert", obj)
      .then(data => {
        setItems(data.data.data)
      })
      .then(_ => {
        toast.success(`Alarme criado com sucesso!`, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setMedicao([]);
        setIdSensor(0);
        setNameSensor("");
        setValueSensor(0);
        setUnitSensor("");
        setCondSensor("0");
        setTimeSensor(0);
        setPositionSensor(0);
        setDestSensor("");
        setShowEdit(false);
      })
      .catch(error => {
        toast.error("Opa colega, deu error aí", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
  }
  // PUT
  function submitHandlePUT(e) {
    e.preventDefault();

    let obj = {
      ID_SENSOR: idSensor,
      VALUE: Number(valueSensor),
      NAME: nameSensor,
      POSITION: Number(PositionSensor),
      UNIT: unitSensor,
      COND: condSensor,
      TIME: Number(TimeSensor),
      EMAIL: DestSensor,
    };
    // console.log('ESTOU ATUALIZANDO= ', obj)
    api.put(`/notify-put-sensor-alert/${IDAlert}`, obj)
      .then(data =>{
        console.log("ATUALIZADO= ",data.data.data)
        return setItems(data.data.data)
      })
      .then(_ => {
        setMedicao([]);
        setIdSensor(0);
        setNameSensor("");
        setValueSensor(0);
        setUnitSensor("");
        setCondSensor("0");
        setTimeSensor(0);
        // setPositionSensor(0);
        setDestSensor("");
        setShowEdit(false);
      })

  }
  // DELETE
  function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja deletar o alarme?")) {
      api.delete(`notify-delete-sensor-alert/${id}`)
        .then(data => {
          setItems(data.data.data)
        })
    }
    // setItems(local);
  }

  // Mostrar o Formulário de edição
  function ShowEditForm(data) {
    setMedicao([]);
    setIdSensor(0);
    setNameSensor("");
    setValueSensor(0);
    setUnitSensor("");
    setCondSensor("0");
    setTimeSensor(0);
    setPositionSensor(0);
    setDestSensor("");
    setShowEdit(true);

    ListOneSensorEdit(data.ID_SENSOR);
    setNameSensor(data.NAME)
    setValueSensor(data.VALUE);
    setCondSensor(data.COND);
    // setUnitSensor(data.UNIT);
    setTimeSensor(data.TIME / 60);
    setIDAlert(data.ID);
    setDestSensor(data.EMAIL);
    setUnitSensor(data.UNIT)
  }
  // Ocultar o Formulário de edição
  function hideEditForm() {
    setMedicao([]);
    setIdSensor(0);
    setNameSensor("");
    setValueSensor(0);
    setUnitSensor("");
    setCondSensor("0");
    setTimeSensor(0);
    setPositionSensor(0);
    setDestSensor("");
    setShowEdit(false);
  }
  // console.log('valueSensor= ',valueSensor)
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
                  <input type="text" value={nameSensor} disabled></input>
                </div>

                <div className="input-group">
                  <label htmlFor="selectMeasures">Medição:</label>
                  <select
                    id="selectMeasures"
                    onChange={(e) => {
                      setPositionSensor(e.target.selectedIndex)
                      console.log('SELECT ', PositionSensor, ' ', NameUnit[PositionSensor])
                      setUnitSensor(e.target.selectedOptions[0].id)
                    }}
                    title="Medida do sensor"
                    required
                  >
                    {medicao.map((item) =>
                      item.map((e, i) => (
                        <option value={i} key={i} data={e.UNIT} id={NameUnit[i]} >
                          {e}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="selectUnit">Valor:  {NameUnit[PositionSensor]}</label>
                  <input
                    type="number"
                    min={0}
                    id="ValueInput"
                    value={valueSensor}
                    onChange={(e) => setValueSensor(e.target.value)}
                    required
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
                      onChange={(e) => {
                        setPositionSensor(e.target.value)
                        setUnitSensor(e.target.selectedOptions[0].id)
                      }}
                      defaultValue="1"
                      title="Medida do sensor"
                      required
                    >
                      <option value="1" disabled>
                        Selecione
                    </option>
                      {medicao.map((item) =>
                        item.map((e, i) => (
                          <option value={`${i}`} key={i} id={NameUnit[i]} >
                            {/* {console.log("UNIDATES= ",NameUnit[i],' ',i)} */}
                            {e}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="selectUnit">Valor: {unitSensor}</label>
                    <input
                      type="number"
                      min={0}
                      id="ValueInput"
                      onChange={(e) => setValueSensor(e.target.value)}
                      value={valueSensor}
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
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
          <ul className="list-cards">
            {local && local.length !== 0 ? (
              local.map((e, i) => (
                <li className="card" key={e.ID}>
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
