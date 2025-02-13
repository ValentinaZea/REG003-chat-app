import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { secret } from "../config";
import { isValidEmail } from "../utils/utils";
//TODO-DONE :CONFIGURAR SECRET MEJOR Y MODIFICAR TIEMPO DEL TOKEN AL PASAR A PROD
// ASSIGNED TO: DENISSITA


export const authController = async (req: NextApiRequest, res: NextApiResponse) => {

  try {
    const { email, password } = req.body;

    if (!email || !password || !isValidEmail(email)) {
      console.log("400 linea17")
      return res.status(400).json({
        ok: false,
        content: null,
        message: "Bad Request",
      });
    }
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user === null) {
      return res.status(404).json({
        ok: false,
        message: 'Not Found'
      })
    };

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        ok: false,
        message: 'Bad Request'
      })
    }
    jwt.sign(
      {
        uid: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: '8h',
      },
      (err, token) => {
        if (err) console.error(err);
        return res.status(200).json(
          {
            ok: true,
            token
          }
        );
      },
    );
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: "server error"
    })
  }

}
