import db from "../database/connections";
import { Request, Response } from "express";


export default class AlertsController {
  async getAlerts(Request, Response) {
    db("notifications")
      .then((data) => {
        return Response.status(200).json({ data });
      })
      .catch((err) => {
        return Response.status(200).json({ err });
      });
  }
  async getOneAlert(Request, Response) {
    db("notifications")
    .where({ id: Request.params.id })
    .then((data) => {
      return Response.status(200).json({ data });
    })
    .catch((err) => {
      return Response.status(200).json({ err });
    });
  }
  async deleteAlert(Request,Response){
    db("notifications")
    .where({ id: Request.params.id })
    .delete()
    .then((_) => {
      database("notifications")
        .then((data) => Response.status(200).json({ data }))
        .catch((err) => {
          throw "Ops, Problema ao deletar um alarme";
        });
    })
    .catch((err) => {
      console.log(err);
      return Response.status(400).json(err);
    });
  }
  async putAlert(Request,Response){
    const {
      TIME,
      VALUE,
      NAME,
      UNIT,
      ID_SENSOR,
      EMAIL,
      NOTE,
      MEDITION_TYPE,
      CONDITION,
      POSITION,
    } = Request.body;
    try {
      db("notifications")
      .where({ id: Request.params.id })
      .update({
        TIME: TIME * 60,
        VALUE,
        UNIT,
        NAME,
        ID_SENSOR,
        EMAIL,
        NOTE,
        MEDITION_TYPE,
        CONDITION,
        POSITION,
      })
      .then((_) => {
        db("notifications")
          .then((data) => Response.status(200).json({ data }))
          .catch((err) => {
            throw "Ops, Problema ao atualizar o banco";
          });
      })
      .catch((error) => {
        console.log(error);
        // return res.status(400).json(error);
        throw "Não foi possível atualizar o alarme";
      });
    } catch (error) {
      return Response.status(400).json(error);
    }
  }
  async postAlert(Request,Response){
    const {
      TIME,
      VALUE,
      NAME,
      UNIT,
      ID_SENSOR,
      EMAIL,
      NOTE,
      MEDITION_TYPE,
      CONDITION,
      POSITION,
    } = Request.body;
    const duplicate = await db("notifications")
      .where("ID_SENSOR", ID_SENSOR)
      .andWhere("CONDITION", CONDITION)
      .andWhere("MEDITION_TYPE", MEDITION_TYPE)
      .andWhere("UNIT", UNIT)
      .andWhere("EMAIL", EMAIL)
      .andWhere("VALUE", VALUE)
      .andWhere("POSITION", POSITION);
    try {
      if (!duplicate.length) {
        db("notifications")
          .insert({
            TIME: TIME * 1,
            // TIME: TIME * 60,
            VALUE,
            NAME,
            UNIT,
            ID_SENSOR,
            EMAIL,
            NOTE,
            MEDITION_TYPE,
            CONDITION,
            POSITION,
          })
          .then((_) => {
            // console.log(data);
            db("notifications")
              .then((data) => Response.status(200).json({ data }))
              .catch((err) => {
                throw "Ops, Problema ao inserir dados no banco";
              });
          })
          .catch((error) => {
            console.log(error);
            throw "Não foi possível cadastrar no banco";
          });
      } else {
        throw error;
      }
    } catch (error) {
      return Response.status(400).json({msg: error.message});
    }
  }

}
