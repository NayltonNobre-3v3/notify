import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { AiFillAlert, AiFillFrown, AiOutlineSearch } from "react-icons/ai";
import api from "../api/api";

// import axios from 'axios'
// import moment from "moment";
import { toast } from "react-toastify";
import * as moment from "moment-timezone";

import "./style.css";

import { useSelector, useDispatch } from "react-redux";
import { listSensor } from "../Actions/SensorListActions";

function Main(props) {
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

  const [searchKeyword, setSearchKeyword] = useState("");

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
    setNameUnit(data.data[0].UNIT);
    setUnitSensor("");
  }

  async function ListOneSensorEdit(e) {
    const data = await api.get(`notify-get-sensors/${e}`);
    const json = JSON.stringify(data.data);
    const medicao = JSON.parse(json);
    const values = medicao.map((item) => item.TYPE);
    setMedicao(values);
    setIdSensor(data.data[0].ID);
    setNameSensor(data.data[0].NAME);
    setNameUnit(data.data[0].UNIT);
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
    // console.log('OBJ ',obj)
    api
      .post("notify-post-sensor-alert", obj)
      .then((data) => {
        setItems(data.data.data);
      })
      .then((_) => {
        toast.success(`Alarme criado com sucesso!`, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });

        setMedicao([]);
        setIdSensor(0);
        setNameSensor("");
        setValueSensor(0);
        setUnitSensor("");
        setCondSensor("");
        setTimeSensor(0);
        setPositionSensor(0);
        setDestSensor("");
        setShowEdit(false);
      })
      .catch((error) => {
        toast.error(`${error.response.data}`, {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });

        console.log('ERROR= ',error.response.data)
      });
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

    api
      .put(`/notify-put-sensor-alert/${IDAlert}`, obj)
      .then((data) => {

        

        return setItems(data.data.data);
      })
      .catch(error=>{
        toast.error("Opa colega, deu error aí", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      })
      .then((_) => {
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
      });
  }
  // DELETE
  function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja deletar o alarme?")) {
      api
        .delete(`notify-delete-sensor-alert/${id}`)
        .then((data) => {
          toast.success(`Alarme deletado com sucesso!`, {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          setItems(data.data.data);
        })
        .then((_) => {
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
        });
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
    setPositionSensor("");
    setDestSensor("");
    setShowEdit(true);
    
    ListOneSensorEdit(data.ID_SENSOR);
    setNameSensor(data.NAME);
    setValueSensor(data.VALUE);
    setCondSensor(data.COND);
    setTimeSensor(data.TIME / 60);
    setIDAlert(data.ID);
    setDestSensor(data.EMAIL);
    setUnitSensor(data.UNIT);
    setPositionSensor(data.POSITION);

    document.body.scrollToBottom()
    
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
  
  function searchSubmit(e) {
    e.preventDefault();
    api
    .get(`/search?name=${searchKeyword}`)
    .then((data) => setItems(data.data));
  }
  return (
    <div className="container">
      <main>
        <div className="monitSelect" id="form">
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
                      setPositionSensor(e.target.selectedIndex);
                      setUnitSensor(e.target.selectedOptions[0].id);
                    }}
                    value={PositionSensor > 0 ? PositionSensor - 1 : 0}
                    title="Medida do sensor"
                    required
                  >
                    {medicao.map((item) =>
                      item.map((e, i) => (
                        <option
                          value={i}
                          key={i}
                          data={e.UNIT}
                          id={NameUnit[i]}
                        >
                          {e}
                        </option>
                      ))
                      )}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="selectUnit">
                    Valor: {NameUnit[PositionSensor]}
                  </label>
                  <input
                    type="number"
                    // min={0}
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
                      setPositionSensor(e.target.value);
                      setUnitSensor(e.target.selectedOptions[0].id);
                    }}
                    defaultValue={unitSensor}
                    title="Medida do sensor"
                    required
                  >
                    <option value="" selected>
                      Selecione
                    </option>
                    {medicao.map((item) =>
                      item.map((e, i) => (
                        <option
                        value={`${i}`}
                          key={i}
                          id={NameUnit[i]}
                          required
                        >
                          {e}
                        </option>
                      ))
                      )}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="selectUnit">
                    Valor: {unitSensor === "1" ? "" : unitSensor}
                  </label>
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
                    value={!condSensor ? "0" : condSensor}
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
                    placeholder="Selecione o tempo"
                    value={TimeSensor}
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

        <div>
          <form onSubmit={searchSubmit} className="search-input-container">
            <input
              type="text"
              placeholder="Pesquisar alerta"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {/* <button type="submit">S</button> */}
            <p onClick={searchSubmit}>
              <AiOutlineSearch size={24} />
            </p>
          </form>
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
                        Condição: {e.COND.toLowerCase()} de {e.VALUE} {e.UNIT}{" "}
                        {e.MEDITION}
                      </p>
                      <p>Tempo para enviar alerta: {e.TIME / 60} min</p>
                    </div>
                    <div id="footer-Container">
                      <p className="date-detail">
                        Alerta criado em{" "}
                        {moment
                          .tz(e.created_at, "America/Fortaleza")
                          .format("DD/MM/YYYY  HH:mm:ss")
                          .toLocaleLowerCase("pt-br")}
                      </p>

                      <div id="buttons-Container">
                        <a
                          
                          className="edit-button"
                          onClick={() => ShowEditForm(e)}
                        >
                          <FaPen color="white" />
                        </a>
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
        </div>
      </main>
    </div>
  );
}

export default Main;
